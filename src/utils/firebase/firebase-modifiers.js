import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { removeItemFromArray } from '../../exports/functions';
import { firestore } from './firebase';

// Adds or removes a user from the typing database field within the message
// thread
export async function editMessageThreadUsersTyping(
  messageThreadId,
  userId,
  isTyping = false
) {
  if (!messageThreadId || !userId) return;

  const threadRef = doc(firestore, 'message_threads', messageThreadId);
  const threadDoc = await getDoc(threadRef);
  let typingUsers = threadDoc.data().typing;

  if (!typingUsers) {
    typingUsers = [userId];
  } else if (isTyping && !typingUsers.includes(userId)) {
    typingUsers.push(userId);
  } else if (!isTyping && typingUsers.includes(userId)) {
    typingUsers = removeItemFromArray(typingUsers, userId);
  }

  try {
    return await updateDoc(threadRef, {
      typing: typingUsers
    })
      .then((res) => true)
      .catch((err) => null);
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Sets the user online or not
export async function editUserOnline(userId, isOnline = false) {
  if (!userId) return;

  const userRef = doc(firestore, 'users', userId);

  try {
    return await updateDoc(userRef, {
      online: isOnline
    })
      .then((res) => true)
      .catch((err) => null);
  } catch (err) {
    console.log(err);
    return null;
  }
}
