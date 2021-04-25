import React, { useState } from 'react';
import Navigation from './Navigation/Navigation';
import { Button } from 'react-bootstrap';
import Content from './Core/Content';
import About from '../About';
import { useHistory } from 'react-router-dom';
import ManageUsers from './Admin/ManageUsers';
import { Switch, Route } from 'react-router-dom';
import { useAuth } from './../contexts/AuthContext';
import ErrorModal from './../util/Error/ErrorModal';

const NoMatchPage = () => {
  return (
    <div className='pl-3 pt-5'>
      <h3>
        <br></br>404 - Not found.
      </h3>
      <h4>Wrong page!</h4>
    </div>
  );
};

const Main = (props) => {
  const { logout, getUserOrgs } = useAuth();
  const styleMain = { direction: 'rtl', textAlign: 'right', padding: '10px' };
  const [error, setErrorName] = useState(null);

  const history = useHistory();
  async function handleLogout() {
    try {
      await logout();
      history.push('/');
    } catch {
      console.log('Failed to log out');
    }
  }

  return getUserOrgs !== null && getUserOrgs !== undefined ? (
    <>
      {error !== null && <ErrorModal errorMsg={error} handleCloseModal={() => setErrorName(null)}></ErrorModal>}
      <Navigation />
      <Switch>
        <Route exact path='/'>
          <Content location={'patient'} handleSetError={(err) => setErrorName(err)} />
        </Route>
        <Route exact path='/archives'>
          <Content location={'archive'} handleSetError={(err) => setErrorName(err)} />
        </Route>
        <Route exact path='/about'>
          <About handleSetError={(err) => setErrorName(err)} />
        </Route>
        <Route path='/manageusers'>
          <ManageUsers handleSetError={(err) => setErrorName(err)} />
        </Route>
        <Route component={NoMatchPage} />
      </Switch>
    </>
  ) : (
    <div style={styleMain}>
      <h3>התחברת בהצלחה.</h3>
      <h4>הינך מועבר למחלקה שלך...</h4>
      <Button onClick={handleLogout}>התנתק</Button>
    </div>
  );
};
export default Main;
