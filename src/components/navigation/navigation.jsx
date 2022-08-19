// React
import { useState } from 'react';

// React Router
import { Outlet, useNavigate } from 'react-router-dom';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// Bootstrap
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

// Evergreen
import { Avatar } from 'evergreen-ui';

// Firebase
import { signOutUser } from '../../utils/firebase/firebase';

// Slices
import {
  selectUser,
  selectDisplayName,
  selectPhotoURL,
  setUser
} from '../../redux/slices/userSlice';

// Exports
import { NAVIGATION_PATHS } from '../../exports/contants';

// Styles
import './navigation.scss';
import './navigation.mobile.scss';

function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const displayName = useSelector(selectDisplayName);
  const photoURL = useSelector(selectPhotoURL);

  const [expanded, setExpanded] = useState(false);

  // Handles what happens when a dropdown menu item is selected
  function handleDropdownItemSelect(eventKey) {
    navigate(eventKey);
    setExpanded(false);
  }

  // Handles signing the user out
  async function handleSigningOut() {
    await signOutUser()
      .then((res) => {
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
            Chat Web App
            {/* <img
                className="navbar-logo d-inline-block align-top"
                alt="Caish Workshop Logo"
              /> */}
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(expanded ? false : 'expanded')}
          />
          <Navbar.Collapse id="basic-navbar-nav">
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
                  />
                }
              >
                {!user && (
                  <NavDropdown.Item eventKey={NAVIGATION_PATHS.sign_in}>
                    Sign In
                  </NavDropdown.Item>
                )}

                {user && (
                  <NavDropdown.Item
                    eventKey={NAVIGATION_PATHS.home}
                    onClick={handleSigningOut}
                  >
                    Sign Out
                  </NavDropdown.Item>
                )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
      {/* <Footer /> */}
    </Container>
  );
}

export default Navigation;
