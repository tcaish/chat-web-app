// React
import { useState } from 'react';

// React Router
import { useNavigate } from 'react-router-dom';

// React Icons
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';

// Evergreen
import { Button, IconButton, TextInputField } from 'evergreen-ui';

// Firebase
import {
  signInWithGooglePopup,
  signInWithFacebookPopup,
  signInWithEmailPassword
} from '../../utils/firebase/firebase';

// Exports
import { handleSignInUpErrors, showToast } from '../../exports/functions';
import { NAVIGATION_PATHS, TOAST_TYPES } from '../../exports/contants';

// Styles
import './sign-in.scss';
import './sign-in.mobile.scss';
import Center from '../../components_styled/Center';

const defaultFormInput = {
  email: '',
  email_missing: false,
  password: '',
  password_missing: false,
  remember: false
};

function SignIn() {
  const navigate = useNavigate();

  const [formInput, setFormInput] = useState(defaultFormInput);
  const [isLoading, setIsLoading] = useState(false);

  // Handles errors when signing in
  function handleSignInErrors(err) {
    let title = 'Error Signing In';
    const description = handleSignInUpErrors(err);

    showToast(title, description, TOAST_TYPES.danger);
  }

  // Redirects user to home page
  function redirectToHomePage() {
    navigate(NAVIGATION_PATHS.home);
  }

  // Signs in user via Google
  async function signInViaGoogle() {
    setIsLoading(true);

    await signInWithGooglePopup()
      .then((res) => {
        setIsLoading(false);
        redirectToHomePage();
      })
      .catch((err) => {
        setIsLoading(false);
        handleSignInErrors(err);
      });
  }

  // Signs in user via Facebook
  async function signInViaFacebook() {
    setIsLoading(true);

    await signInWithFacebookPopup()
      .then((res) => {
        setIsLoading(false);
        redirectToHomePage();
      })
      .catch((err) => {
        setIsLoading(false);
        handleSignInErrors(err);
      });
  }

  // Signs in user via email/password
  async function signInViaEmailPassword() {
    if (!formInput.email || !formInput.password) {
      setFormInput({
        ...formInput,
        email_missing: formInput.email === '',
        password_missing: formInput.password === ''
      });
      return;
    }

    setIsLoading(true);

    await signInWithEmailPassword(formInput.email, formInput.password)
      .then((res) => {
        setIsLoading(false);
        setFormInput(defaultFormInput);
        redirectToHomePage();
      })
      .catch((err) => {
        setIsLoading(false);
        setFormInput({
          ...formInput,
          email_missing: false,
          password_missing: false
        });
        handleSignInErrors(err);
      });
  }

  return (
    <Center>
      <div className="sign-in-container">
        <div className="sign-in-header-container">
          <Center>
            <span className="sign-in-title">Sign in with a provider</span>
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
            type="Email"
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
            type="Password"
            placeholder=""
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
        </div>

        <div className="sign-in-button-container sign-in-up-button-margin">
          <Button
            className="log-in-button"
            isLoading={isLoading}
            onClick={signInViaEmailPassword}
          >
            Sign In
          </Button>
        </div>

        <div className="sign-in-create-account-container">
          <Center>
            <Button
              appearance="minimal"
              onClick={() => navigate(`/${NAVIGATION_PATHS.sign_up}`)}
            >
              Create an Account
            </Button>
          </Center>
        </div>
      </div>
    </Center>
  );
}

export default SignIn;
