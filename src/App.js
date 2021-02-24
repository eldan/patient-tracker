import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Main from "./components/Main";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Account/Login";
import Register from "./components/Account/Register";



const App = () => {
  return (
    <Router basename={process.env.REACT_APP_ROOT}>
      <AuthProvider>
        <Switch>
          <Route path="/Login" component={Login} />
          <Route path="/Register" component={Register} />
          <PrivateRoute path="/" component={Main} />
        </Switch>
      </AuthProvider>
    </Router>
  );
};
export default App;
