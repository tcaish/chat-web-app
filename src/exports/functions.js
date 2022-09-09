import { toaster } from 'evergreen-ui';
import { Timestamp } from 'firebase/firestore';
import { editUserOnline } from '../utils/firebase/firebase-modifiers';
import { SOUND_TYPES, TOAST_TYPES } from './contants';
import ReceivedSound from '../assets/sounds/received.mp3';
import SentSound from '../assets/sounds/sent.mp3';

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

// Shows a toast given all information
export function showToast(
  title,
  description = '',
  toastType = TOAST_TYPES.success
) {
  if (toastType === TOAST_TYPES.success) {
    toaster.success(title, { description, duration: 4 });
  } else if (toastType === TOAST_TYPES.danger) {
    toaster.danger(title, { description, duration: 7 });
  } else if (toastType === TOAST_TYPES.warning) {
    toaster.warning(title, { description, duration: 7 });
  }
}

// Plays a sound based on the given sound type
export function playSound(soundType) {
  let audio;

  if (soundType === SOUND_TYPES.sent) {
    audio = new Audio(SentSound);
  } else if (soundType === SOUND_TYPES.receive) {
    audio = new Audio(ReceivedSound);
  }

  audio.play();
}

// Check if a message has been sent within the past 5 seconds and is not from
// the current user.
export function isMessageNewFromRecipient(messageObj, userId) {
  if (!messageObj || !userId) return;

  const now = new Date().getTime();
  const sent = messageObj.sent_at.toDate();
  const fiveSeconds = 5000;

  return now - sent <= fiveSeconds && messageObj.sender !== userId;
}

// Returns the amount of time since a given date
export function timeSince(date) {
  let seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ' years';
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months';
  }

  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days';
  }

  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours';
  }

  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes';
  }

  return Math.floor(seconds) + ' seconds';
}
