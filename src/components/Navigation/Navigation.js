import classes from "./Navigation.module.css";
import React, { useState } from "react";
import { Nav, Navbar, NavDropdown, Dropdown } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "./../../contexts/AuthContext";

const Navigation = (props) => {
  const [, setError] = useState("");
  const {
    currentUser,
    logout,
    getUserFullName,
    getDefaultOrgID,
    setNewDefaultOrgID,
    getUserOrgs,
  } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");
    try {
      await logout();
      history.push("/");
    } catch {
      setError("Failed to log out");
    }
  }
  const changeOrg = function (id) {
    setNewDefaultOrgID(id);
  };

  const OrgList = () => {
    var a = Object.keys(getUserOrgs).map(function (key) {
      return (
        <Dropdown.Item
          className={classes["DropdownItem"]}
          key={key}
          onClick={(ev) => changeOrg(key)}
        >
          {getUserOrgs[key].name}
        </Dropdown.Item>
      );
    });
    return a;
  };

  // Validate in FireBase
  function isAdmin(){
    if (getUserOrgs[getDefaultOrgID].admin !== undefined) return true;
    return false;
  }

  const RenderNav = () => {
    return (
      <>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{top:'0px'}}>
          <Navbar.Brand href="#home">
            <span>Patient Tracker</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} eventKey="0" to="/">
                Patients
              </Nav.Link>
              <Nav.Link as={Link} eventKey="1" to="/archives">
                Archive
              </Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown.Divider />
              <span
                className={classes["selectOrgs"]}
                style={{
                  fontSize: ".5em",
                  float: "right",
                  backgroundColor: "#343a40 !important",
                }}
              >
                <Dropdown>
                  <Dropdown.Toggle
                    variant="secondary"
                    id="dropdown-basic"
                    size="sm"
                  >
                    {/* TODO: only after all auth has been loaded refresh data */}
                    Organisation:&nbsp;
                    {getDefaultOrgID ? getUserOrgs[getDefaultOrgID].name : null}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className={classes["Dropdown"]}>
                    <OrgList />
                  </Dropdown.Menu>
                </Dropdown>
              </span>

              {isAdmin ? ( //TODO Refactor FireBase to prevent admin has all orgs in DB
                <>
                  <NavDropdown.Divider />
                  <Nav.Link as={Link} eventKey="0" to="/manageusers">
                    Admin
                  </Nav.Link>
                </>
              ) : null}
              <NavDropdown.Divider />
              <Nav.Link as={Link} eventKey="2" to="/about">
                About
              </Nav.Link>
              <Nav.Link onClick={handleLogout}>
                Logout ({currentUser !== null ? getUserFullName : ""})
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </>
    );
  }
  return (getUserOrgs ? <RenderNav />: null)

};
export default Navigation;
