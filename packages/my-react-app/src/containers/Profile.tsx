import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Profile.css";
import { ProfileImage } from "./Img/profileImage.tsx";

export default function Profile() {
  return (
    <div className="profile-page">
      <Navbar collapseOnSelect bg="light" expand="md" className="px-4">
        <LinkContainer to="/profile">
          <Navbar.Brand className="Title text-muted mx-2">
            User Name
          </Navbar.Brand>
        </LinkContainer>
        <ProfileImage />
        <Navbar.Collapse className="justify-content-start">
          <Nav activeKey={window.location.pathname}>
            <Nav.Link>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="dashboard px-4">Dashboard</div>
      <div className="content flex-grow-1 px-4 py-5">
        <div className="profile flex-grow-1 py-3 px-2"></div>
      </div>
    </div>
  );
}

/*
Set-up:
- A logout button is needed in the Profile component.
- 
-
 */
