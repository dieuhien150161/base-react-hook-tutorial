import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import logoApp from "../assets/images/logo192.png";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

const Header = (props) => {
  const navigate = useNavigate();
  const { logout, user } = useContext(UserContext);
  const [hideHeader, setHideHeader] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logout Success");
  };

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
        {((user && user.auth) || window.location.pathname === "/") && (
          <>
            <Nav className="me-auto">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
              <NavLink to="/users" className="nav-link">
                Manage User
              </NavLink>
            </Nav>
            <Nav>
              {user && user.email && (
                <span className="nav-link">Welcome {user.email}</span>
              )}
              <NavDropdown title="Setting" id="basic-nav-dropdown">
                {user && user.auth === true ? (
                  <NavDropdown.Item onClick={() => handleLogout()}>
                    Logout
                  </NavDropdown.Item>
                ) : (
                  <NavLink to="/login" className="dropdown-item">
                    Login
                  </NavLink>
                )}
              </NavDropdown>
            </Nav>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
