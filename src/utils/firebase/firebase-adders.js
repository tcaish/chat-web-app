import { addDoc, collection } from 'firebase/firestore';
import { firestore } from './firebase';

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
