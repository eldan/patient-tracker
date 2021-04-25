import React, { useState } from "react";
import { Button, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { db, auth } from "./../../services/firebase";


const Register = (props) => {
  const history = useHistory();
  const [getTitle, setTitle] = useState("ד״ר");
  const [getPname, setPname] = useState("");
  const [getFname, setFname] = useState("");
  const [getEmail, setEmail] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getPassword2, setPassword2] = useState("");

  const [getLocalError, setLocalError] = useState(null);

  const submitForm = () => {
    let isFormValidClientSide = true;
    if (getPassword !== getPassword2) {
        setLocalError("סיסמא לא תואמת");
        isFormValidClientSide = false;
    }

    if (getPname === "" || getFname === "" || getEmail === "") {
      setLocalError("חסרים שדות");
      isFormValidClientSide = false;
    }
   
    if (isFormValidClientSide) {
      //1. Auth if possible
          auth
          .createUserWithEmailAndPassword(getEmail, getPassword)
          .then((user) => {
             const data = {
                email: getEmail, privateName: getPname, familyName: getFname, title: getTitle
             }
             try {
               var reff1 = db.ref("users/");
               var reff2 = reff1.push();
               reff2.set(data, function (error) {
                 if (error) {
                   alert("Data could not be saved." + error);
                 } else {
                   history.push("/");
                 }
               });
             } catch (e) {
               console.log(e);
             }
          })
          .catch((error) => {
            var errorMessage = error.message;
            setLocalError(errorMessage);
          });
    }
  };
  const closeModal = () => {
    history.goBack();
  }
  return (
    <>
      <Modal show={true} onHide={closeModal} dismissible>
        <Modal.Header closeButton>
          <Modal.Title className='hebrew'> רישום רופא חדש</Modal.Title>
        </Modal.Header>

        <Form>
          <Modal.Body className='hebrew'>
            {getLocalError !== null ? (
              <Alert variant='danger' onClose={() => setLocalError(null)} dismissible>
                {getLocalError}
              </Alert>
            ) : null}
            <Form.Group as={Row} controlId='email'>
              <Form.Label column sm='12'>
                דואר אלקטרוני
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  type='email'
                  placeholder='דואר אלקטרוני'
                  value={getEmail}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='title'>
              <Form.Label column sm='12'>
                תואר
              </Form.Label>

              <Col sm='9' className='mt-2'>
                <Form.Check
                  inline
                  name='my'
                  label='דוקטור'
                  type='radio'
                  id='1'
                  key='1'
                  checked
                  onChange={(e) => setTitle('ד״ר')}
                />
                <Form.Check
                  name='my'
                  id='2'
                  key='2'
                  inline
                  label='פרופסור'
                  type='radio'
                  onChange={(e) => setTitle('פרופ׳')}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId='pname'>
              <Form.Label column sm='12'>
                שם פרטי
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  type='text'
                  placeholder='שם פרטי'
                  value={getPname}
                  onChange={(e) => setPname(e.target.value)}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId='fname'>
              <Form.Label column sm='12'>
                שם משפחה
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  type='text'
                  placeholder='שם משפחה'
                  value={getFname}
                  onChange={(e) => setFname(e.target.value)}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId='password'>
              <Form.Label column sm='12'>
                בחר סיסמה
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  type='password'
                  placeholder='סיסמא'
                  value={getPassword}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='password2'>
              <Form.Label column sm='12'>
                ודא סיסמה
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  type='password'
                  placeholder='ודא סיסמה'
                  value={getPassword2}
                  onChange={(e) => setPassword2(e.target.value)}
                />
              </Col>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='link' onClick={submitForm}>
              הירשם
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Register;
