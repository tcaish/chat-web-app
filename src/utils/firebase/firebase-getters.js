import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { userConverter } from '../../classes/User';
import { removeItemFromArray } from '../../exports/functions';
import { firestore } from './firebase';

// Returns the message threads for a given user
export async function getMessageThreadsForUser(userId) {
  let messageThreads = [];

  const threadsRef = doc(firestore, 'message_threads_for_user', userId);
  const threadsDoc = await getDoc(threadsRef);
  messageThreads = Object.keys(threadsDoc.data());

  return messageThreads;
}

// Returns the message thread users database objects
export async function getMessageThreadUsersForMessageThreads(
  userId,
  messageThreads
) {
  const messageThreadUsers = [];
  const mThreadUsersRef = collection(firestore, 'message_thread_users');
  const q = query(
    mThreadUsersRef,
    where('message_thread_id', 'in', messageThreads)
  );
  const mThreadUserSnapshot = await getDocs(q);

  mThreadUserSnapshot.forEach((doc) => {
    const data = doc.data();
    let returnedData = [];

    // Returns the user UIDs except for the given userId
    let users = Object.keys(data);
    users = removeItemFromArray(users, 'message_thread_id');
    users = removeItemFromArray(Object.keys(data), userId);

    returnedData.users = users;
    returnedData.message_thread_id = doc.id;

    messageThreadUsers.push(returnedData);
  });

  return messageThreadUsers;
}

// Returns the user information for all users given
export async function getUsersForMessageThreads(users) {
  const usersList = [];

  const usersRef = collection(firestore, 'users').withConverter(userConverter);
  const q = query(usersRef, where('uid', 'in', users));

  const usersSnapshot = await getDocs(q);
  usersSnapshot.forEach((doc) => {
    usersList.push(doc.data());
  });
  return usersList;
}
