import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Avatar } from 'evergreen-ui';
import { signOutUser } from '../../utils/firebase/firebase';
import {
  selectUser,
  selectDisplayName,
  selectPhotoURL,
  setUser
} from '../../redux/slices/userSlice';
import { NAVIGATION_PATHS } from '../../exports/contants';
import './navigation.scss';
import './navigation.mobile.scss';
import { editUserOnline } from '../../utils/firebase/firebase-modifiers';
import UpdateProfilePictureModal from '../modals/update-profile-picture-modal/update-profile-picture-modal';
import Logo from '../../assets/images/logo.png';

function Navigation({ showSideMenu, setShowSideMenu }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const displayName = useSelector(selectDisplayName);
  const photoURL = useSelector(selectPhotoURL);

  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Handles what happens when a dropdown menu item is selected
  function handleDropdownItemSelect(eventKey) {
    if (eventKey) navigate(eventKey);
    setExpanded(false);
  }

  // Handles signing the user out
  async function handleSigningOut() {
    await signOutUser()
      .then((res) => {
        editUserOnline(user.uid, false);

        setExpanded(false);
        dispatch(setUser(null));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Container>
      <Navbar expand="lg" sticky="top" expanded={expanded}>
        <Container>
          <Navbar.Brand
            onClick={() => {
              setExpanded(false);
              navigate(NAVIGATION_PATHS.home);
            }}
          >
            <img
              className="navbar-logo d-inline-block align-top"
              alt="Chat Web App"
              src={Logo}
            />
          </Navbar.Brand>

          <Nav className="me-auto">
            {/* This is needed to keep avatar on right. */}
          </Nav>
          <Nav onSelect={handleDropdownItemSelect}>
            <NavDropdown
              className="avatar-dropdown-link"
              title={
                <Avatar
                  size={50}
                  referrerPolicy="no-referrer"
                  name={displayName ? displayName : ''}
                  src={photoURL ? photoURL : ''}
                  style={{ backgroundColor: !photoURL ? 'white' : 'none' }}
                />
              }
            >
              {!user && (
                <NavDropdown.Item eventKey={NAVIGATION_PATHS.sign_in}>
                  Sign In
                </NavDropdown.Item>
              )}

              {user && (
                <>
                  <NavDropdown.Item
                    active={false}
                    onClick={() => setShowModal(true)}
                  >
                    Profile Picture
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    active={false}
                    eventKey={NAVIGATION_PATHS.home}
                    onClick={handleSigningOut}
                  >
                    Sign Out
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>

      <Outlet />

      {showModal && (
        <UpdateProfilePictureModal
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </Container>
  );
}

export default Navigation;
