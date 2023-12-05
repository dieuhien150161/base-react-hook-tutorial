import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import logoApp from "../assets/images/logo192.png";
import { useLocation, NavLink } from "react-router-dom";

const Header = (props) => {
  const location = useLocation();

  return (
    <Navbar expand="lg" className="bg-body-tertiary header">
      <Navbar.Brand href="/">
        <img
          src={logoApp}
          width={30}
          height={30}
          className="d-inline-block align-top"
        />
        <span>App User</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/users" className="nav-link">
            Manage User
          </NavLink>
        </Nav>
        <Nav>
          <NavDropdown title="Setting" id="basic-nav-dropdown">
            <NavDropdown.Item href="/login">Login</NavDropdown.Item>
            <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
