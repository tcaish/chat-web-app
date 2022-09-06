import { Timestamp } from 'firebase/firestore';
import { editUserOnline } from '../utils/firebase/firebase-modifiers';

// Signing in and out
export function handleSignInUpErrors(err) {
  let description = '';

  switch (err.code) {
    case 'auth/invalid-email':
      description = 'This email address is not in the correct format.';
      break;
    case 'auth/email-already-in-use':
      description = 'This email address is already in use.';
      break;
    case 'auth/weak-password':
      description =
        'Weak password. Password length must be at least 6 characters.';
      break;
    case 'auth/wrong-password':
      description = 'Password is invalid.';
      break;
    case 'auth/user-not-found':
      description =
        'This email/password combination does not match our records.';
      break;
    case 'auth/account-exists-with-different-credential':
      description = 'This is not the original provider you signed in with.';
      break;
    case 'auth/too-many-requests':
      description =
        'Account has been temporarily disabled due to many failed login ' +
        'attempts. Restore it by resetting your password, or try again later.';
      break;
    default:
      description = 'There was an issue signing in. Please try again!';
      break;
  }

  return description;
}

// Returns a firebase timestamp given a date
export function getFirebaseTimestampFromDate(date) {
  return Timestamp.fromDate(date);
}

// Returns a date formatted as mm/dd/yyyy
export function getFormattedDate(date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return month + '/' + day + '/' + year;
}

// Validates a string is an email
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// Removes an item from an array given the value
export function removeItemFromArray(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

let time;

// Listens for inactivity from the user and sets the user online/offline
// accordingly.
export async function listenForUserInactive(userUid) {
  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;

  // Sets the user online/offline
  async function setUserOnline(isOnline) {
    await editUserOnline(userUid, isOnline);
  }

  // Sets user online and resets the timer
  async function resetTimer() {
    await setUserOnline(true);

    clearTimeout(time);
    time = setTimeout(() => setUserOnline(false), 30000);
  }
}

// Stops listening for inactivity from the user
export function stopListeningForUserInactive() {
  window.onload = null;
  document.onmousemove = null;
  document.onkeydown = null;
  clearTimeout(time);
}

// Checks if the user logged in can upload a new profile picture by checking
// if they are signed in via username/password or a provider.
export function canUploadNewProfilePicture(user) {
  if (!user) return;

  return user.providerData[0].providerId === 'password';
}

// Updates a file's file name with the user's UID
export function updateProfilePictureFileName(userId, file) {
  const [, fileType] = file.name.split('.');
  const newFileName = `${userId}.${fileType}`;

  const blob = file.slice(0, file.size, file.type);
  const newFile = new File([blob], newFileName, { type: file.type });

  return newFile;
}
