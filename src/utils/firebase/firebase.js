// Firebase
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updateEmail
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCP36_F9MdodpI5-d4pCTJ84BLRaS3KcPQ',
  authDomain: 'chat-web-app-b0645.firebaseapp.com',
  projectId: 'chat-web-app-b0645',
  storageBucket: 'chat-web-app-b0645.appspot.com',
  messagingSenderId: '657830369466',
  appId: '1:657830369466:web:df06cbe56ec473927d8a83',
  measurementId: 'G-Y8B79BB7B1'
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
getAnalytics(firebaseApp);

// Auth
export const auth = getAuth();

// Auth - Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

// Auth - Facebook provider
const facebookProvider = new FacebookAuthProvider();
facebookProvider.setCustomParameters({
  display: 'popup'
});
export const signInWithFacebookPopup = () =>
  signInWithPopup(auth, facebookProvider);

// Auth - email and password
export async function createAuthUserWithEmailAndPassword(email, password) {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
}

// Sign in with an email and password
export const signInWithEmailPassword = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Sign out user
export const signOutUser = async () => {
  await signOut(auth);
};

// Listen to changes in authentication
export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

// Auth - profile
// Update a user's profile with given options
export const updateUserProfile = (additionalInfo) =>
  updateProfile(auth.currentUser, additionalInfo);

// Update the user's email with a new one
export const updateUserEmail = (email) => updateEmail(auth.currentUser, email);

// Firestore
export const firestore = getFirestore();

// Adds user to database if not already there
export async function createUserDocumentFromAuth(
  userAuth,
  additionalInfo = {}
) {
  if (!userAuth) return;

  const userDocRef = doc(firestore, 'users', userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  // if user data exists
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const created_at = new Date();

    try {
      await setDoc(userDocRef, {
        display_name: displayName,
        email,
        created_at,
        ...additionalInfo
      });
      return { type: 'set' };
    } catch (error) {
      return { error };
    }
  }

  const userData = await getDoc(userDocRef);
  return { type: 'get', data: userData.data() };
}

// export async function editUserRating(rating, ratingId, userId, productId) {
//   if (!rating || !ratingId || !userId || !productId) return;

//   const ratingRef = doc(firestore, 'ratings', ratingId);

//   // If rating exists for user for given product
//   if (!ratingRef.empty) {
//     const createdAt = getFirebaseTimestampFromDate(new Date());

//     try {
//       return await updateDoc(ratingRef, {
//         rating,
//         submitted: createdAt
//       })
//         .then((res) => true)
//         .catch((err) => null);
//     } catch (err) {
//       console.log(err);
//       return null;
//     }
//   } else {
//     return null;
//   }
// }

// Removes an item from the user's cart
// export async function removeCartItem(userId, cartProductId) {
//   if (!userId || !cartProductId) return;

//   const cartProductRef = doc(firestore, 'users', userId, 'cart', cartProductId);
//   return await deleteDoc(cartProductRef);
// }

// Updates the user with the given options
export async function updateUser(userId, options) {
  if (!userId || !options) return;

  const userRef = doc(firestore, 'users', userId);
  return await updateDoc(userRef, options);
}

// Removes all items from the user's cart
// export async function updateAllCartItemsToPurchased(userId) {
//   if (!userId) return;

//   const batch = writeBatch(firestore);
//   const cartRef = collection(firestore, 'users', userId, 'cart');
//   const q = query(cartRef, where('purchased', '==', false));
//   const querySnapshot = await getDocs(q);

//   querySnapshot.forEach((document) => {
//     const cartProductRef = doc(firestore, 'users', userId, 'cart', document.id);
//     batch.update(cartProductRef, { purchased: true });
//   });

//   return await batch.commit();
// }
