import React, { useState } from "react";
import { Jumbotron, Container, Button, Form } from "react-bootstrap";

import { useHistory } from "react-router-dom";
import { useAuth } from "./../../contexts/AuthContext";

import WaitIcon from "./../../util/Wait/Wait";
import splash from "./../../images/splash.png";

import packageJson from './../../../package.json';

const Login = (props) => {
  
  const { currentUser } = useAuth();
  const history = useHistory();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await login(userName, password);
      history.push("/");
    } catch {
      setError("כניסה שגויה");
    }
    setLoading(false);
  }
  const register = () => {
    history.push("/register");
  }
  return (
    <>
      {loading ? <WaitIcon /> : null}

      <Container className='p-2'>
        <Jumbotron>
          {currentUser ? <div>You are already login.</div> : null}
          <div className='text-right'>
            <img alt='' src={splash} style={{ width: '100px' }} />
          </div>

          <hr />
          <h1>Patient Tracker {packageJson.version}</h1>
          <Form>
            <Form.Group controlId='formBasicEmail'>
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <Form.Text className='text-muted'>שם משתמש</Form.Text>
            </Form.Group>

            <Form.Group controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className='alertMsg'>{error}</div>
            </Form.Group>

            <Button variant='primary' onClick={handleSubmit} type='submit'>
              Login
            </Button>
            <div>
              Did you get an invite? Go ahead{' '}
              <Button variant='link' href='#' onClick={register}>
                Register
              </Button>
            </div>
          </Form>
        </Jumbotron>
      </Container>
    </>
  );
};
export default Login;
