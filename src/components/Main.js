import React from "react";
import Navigation from "./Navigation/Navigation";
import { Button } from "react-bootstrap";
import Content from "./Core/Content";
import About from "../About";
import { useHistory } from "react-router-dom";
import ManageUsers from "./Admin/ManageUsers";
import { Switch, Route } from "react-router-dom";
import { useAuth } from "./../contexts/AuthContext";

const NoMatchPage = () => {
  return (
    <>
      <br />
      <br />
      <br />
      <h3>404 - Not found.</h3>
      Wrong page!
    </>
  );
};

const Main = (props) => {
  const { logout, getUserOrgs } = useAuth();

  const history = useHistory();
  async function handleLogout() {
    try {
      await logout();
      history.push("/");
    } catch {
      console.log("Failed to log out");
    }
  }
  return getUserOrgs !== null && getUserOrgs !== undefined ? (
    <>
      <Navigation />
      <Switch>
        <Route exact path="/">
          <Content location={"patient"} />
        </Route>
        <Route exact path="/archives">
          <Content location={"archive"} />
        </Route>
        <Route exact path="/about">
          <About />
        </Route>
        <Route path="/manageusers">
          <ManageUsers />
        </Route>
        <Route component={NoMatchPage} />
      </Switch>
    </>
  ) : (
    <>
      <p style={{ direction: "rtl", textAlign: "right", padding: "10px" }}>
        <h3>התחברת בהצלחה.</h3>
        <h4>צור קשר עם מנהל המחלקה כדי שישייך אותך למחלקה.</h4>
        <Button onClick={handleLogout}>התנתק</Button>
      </p>
    </>
  );
};
export default Main;
