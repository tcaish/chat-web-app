// React
import { useState } from 'react';

// React Redux
import { useDispatch } from 'react-redux';

// React Router
import { useNavigate } from 'react-router-dom';

// React Icons
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';

// Evergreen
import { Button, IconButton, TextInputField, toaster } from 'evergreen-ui';

// Firebase
import {
  signInWithGooglePopup,
  signInWithFacebookPopup,
  createAuthUserWithEmailAndPassword,
  updateUserProfile
} from '../../utils/firebase/firebase';

// Slices
import { setUser } from '../../redux/slices/userSlice';

// Functions
import { handleSignInUpErrors } from '../../exports/functions';

// Styles
import '../sign-in/sign-in.scss';
import './sign-up.scss';
import { NAVIGATION_PATHS } from '../../exports/contants';
import Center from '../../components_styled/Center';
import { updateUser } from '../../utils/firebase/firebase-modifiers';

const defaultFormInput = {
  displayName: '',
  email: '',
  email_missing: false,
  password: '',
  password_missing: false,
  confirmPassword: '',
  confirm_password_missing: false
};

function SignUp() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [formInput, setFormInput] = useState(defaultFormInput);
  const [isLoading, setIsLoading] = useState(false);

  // Redirects the user to the home page
  function redirectToHomePage() {
    navigate(NAVIGATION_PATHS.home);
  }

  // Handles errors when signing up
  function handleSignUpErrors(err) {
    let title = 'Error Signing Up';
    const description = handleSignInUpErrors(err);

    toaster.danger(title, {
      description,
      duration: 7
    });
  }

  // Shows the confirm password helper text
  function renderConfirmPasswordHelperText() {
    if (
      !formInput.password ||
      formInput.password === '' ||
      !formInput.confirmPassword ||
      formInput.confirmPassword === ''
    )
      return;

    return formInput.password !== formInput.confirmPassword ? false : true;
  }

  // Signs up user via Google
  async function signInViaGoogle() {
    setIsLoading(true);

    await signInWithGooglePopup()
      .then((res) => {
        setIsLoading(false);
        redirectToHomePage();
      })
      .catch((err) => {
        setIsLoading(false);
        handleSignUpErrors(err);
      });
  }

  // Signs up user via Facebook
  async function signInViaFacebook() {
    setIsLoading(true);

    await signInWithFacebookPopup()
      .then((res) => {
        setIsLoading(false);
        redirectToHomePage();
      })
      .catch((err) => {
        setIsLoading(false);
        handleSignUpErrors(err);
      });
  }

  // Signs user up via email/password
  async function signUpViaEmailPassword() {
    if (!formInput.email || !formInput.password || !formInput.confirmPassword) {
      setFormInput({
        ...formInput,
        email_missing: formInput.email === '',
        password_missing: formInput.password === '',
        confirm_password_missing: formInput.confirmPassword === ''
      });
      return;
    }

    if (formInput.password !== formInput.confirmPassword) {
      toaster.danger('Password Error', {
        description: 'Your passwords do not match.',
        duration: 7
      });
      return;
    }

    setIsLoading(true);

    await createAuthUserWithEmailAndPassword(
      formInput.email,
      formInput.password
    )
      .then((createRes) => {
        let newUser = createRes.user;

        try {
          updateUserProfile({
            displayName: formInput.displayName
          });
          updateUser(newUser.uid, { display_name: formInput.displayName });

          newUser.displayName = formInput.displayName;

          dispatch(setUser(newUser));
          setFormInput(defaultFormInput);

          redirectToHomePage();
        } catch (err) {
          handleSignUpErrors(err);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setFormInput({
          ...formInput,
          email_missing: false,
          password_missing: false,
          confirm_password_missing: false
        });
        handleSignUpErrors(err);
      });
  }

  return (
    <Center>
      <div className="sign-in-container">
        <div className="sign-in-header-container">
          <Center>
            <span className="sign-in-title">Sign up with a provider</span>
          </Center>

          <Center>
            <div className="sign-in-auth-providers-container">
              <IconButton
                className="facebook-icon"
                aria-label="Facebook"
                fontSize="30px"
                icon={<BsFacebook size="35px" />}
                onClick={signInViaFacebook}
              />
              <IconButton
                className="google-icon"
                variant="link"
                aria-label="Google"
                fontSize="30px"
                icon={<FcGoogle size="35px" />}
                onClick={signInViaGoogle}
              />
            </div>
          </Center>
        </div>

        <div className="sign-in-inputs-container">
          <TextInputField
            type="text"
            placeholder="John Doe"
            label="Full Name"
            required
            value={formInput.displayName}
            onChange={(event) =>
              setFormInput({
                ...formInput,
                displayName: event.target.value
              })
            }
          />

          <TextInputField
            type="email"
            placeholder="john.doe@gmail.com"
            label="Email"
            value={formInput.email}
            isInvalid={formInput.email_missing}
            required
            onChange={(event) =>
              setFormInput({
                ...formInput,
                email: event.target.value,
                email_missing: event.target.value === ''
              })
            }
          />

          <TextInputField
            type="password"
            placeholder=" "
            label="Password"
            value={formInput.password}
            isInvalid={formInput.password_missing}
            required
            onChange={(event) =>
              setFormInput({
                ...formInput,
                password: event.target.value,
                password_missing: event.target.value === ''
              })
            }
          />

          <TextInputField
            type="password"
            placeholder=" "
            label="Confirm Password"
            value={formInput.confirmPassword}
            isInvalid={formInput.confirm_password_missing}
            hint={renderConfirmPasswordHelperText() ? 'Passwords match' : null}
            validationMessage={
              !renderConfirmPasswordHelperText()
                ? 'Passwords do not match'
                : null
            }
            required
            onChange={(event) =>
              setFormInput({
                ...formInput,
                confirmPassword: event.target.value,
                confirm_password_missing: event.target.value === ''
              })
            }
          />
        </div>

        <div className="sign-in-button-container">
          <Button
            className="log-in-button"
            isLoading={isLoading}
            onClick={signUpViaEmailPassword}
          >
            Sign Up
          </Button>
        </div>

        <div className="sign-in-create-account-container">
          <Center>
            <Button
              appearance="minimal"
              onClick={() => navigate(`/${NAVIGATION_PATHS.sign_in}`)}
            >
              Sign In
            </Button>
          </Center>
        </div>
      </div>
    </Center>
  );
}

export default SignUp;
