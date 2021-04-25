import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Main from './components/Main';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Account/Login';
import Register from './components/Account/Register';
import ErrorModal from './util/Error/ErrorModal';

const App = () => {
  const [error, setErrorName] = useState(null);

  return (
    <Router basename={process.env.REACT_APP_ROOT}>
      {/* TODO change error handling with useContext */}

      {error !== null && <ErrorModal errorMsg={error} handleCloseModal={() => setErrorName(null)}></ErrorModal>}
      <AuthProvider handleSetError={(err) => setErrorName(err)}>
        <Switch>
          <Route path='/Login' component={Login} />
          <Route path='/Register' component={Register} />
          <PrivateRoute path='/' component={Main} />
        </Switch>
      </AuthProvider>
    </Router>
  );
};
export default App;
