import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfilePictureFileName } from '../../exports/functions';
import { firestore, storage, updateUserProfile } from './firebase';
import { updateUser } from './firebase-modifiers';

// Adds a message to the message thread
export async function addMessageToMessageThread(messageThreadId, options) {
  if (!messageThreadId || !options) return;

  const messagesRef = collection(
    firestore,
    'message_threads',
    messageThreadId,
    'messages'
  );

  return await addDoc(messagesRef, options)
    .then((res) => {
      return { added: true, error: '' };
    })
    .catch((err) => {
      return { added: false, error: err.code };
    });
}

// Adds a new message thread
export async function addNewMessageThread(userUids) {
  if (!userUids) return;

  const threadsRef = collection(firestore, 'message_threads');
  let newMessageThread = { users: userUids, typing: [] };

  try {
    const docRef = await addDoc(threadsRef, newMessageThread);
    newMessageThread.id = docRef.id;

    return { added: true, data: newMessageThread, error: '' };
  } catch (err) {
    console.log(err);
    return { added: false, error: err };
  }
}

// Uploads a new profile picture to storage for the given user
export async function uploadProfilePicture(userId, file) {
  if (!userId || !file) return;

  // Update file name to have userId instead of actual name
  const updatedFile = updateProfilePictureFileName(userId, file);

  const picturesRef = ref(
    storage,
    `profile_pictures/${updatedFile.name}`,
    updatedFile
  );

  try {
    await uploadBytes(picturesRef, updatedFile);
    const downloadUrl = await getDownloadURL(picturesRef).then((url) => {
      updateUser(userId, { photo_url: url });
      updateUserProfile({ photoURL: url });
      return url;
    });
    return { added: true, url: downloadUrl, error: '' };
  } catch (err) {
    console.log(err);
    return { added: false, error: err };
  }
}
