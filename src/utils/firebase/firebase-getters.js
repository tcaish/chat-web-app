import {
  collection,
  collectionGroup,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { messageConverter } from '../../classes/Message';
import { firestore } from './firebase';

// Returns all messages for a given message thread
export async function getMessages() {
  let messages = [];

  const messagesRef = collectionGroup(firestore, 'messages').withConverter(
    messageConverter
  );
  const q = query(messagesRef);
  const messagesSnapshot = await getDocs(q);

  messagesSnapshot.forEach((doc) => {
    let data = doc.data();
    data.id = doc.id;
    messages.push(data);
  });

  return messages;
}

// Returns the message threads for a given user
export async function getMessageThreadsForUser(userId) {
  let messageThreads = [];

  const threadsRef = collection(firestore, 'message_threads');
  const q = query(threadsRef, where('users', 'array-contains-any', [userId]));
  const threadsSnapshot = await getDocs(q);

  threadsSnapshot.forEach((doc) => {
    let data = doc.data();
    data.id = doc.id;
    messageThreads.push(data);
  });

  return messageThreads;
}
