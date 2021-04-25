import React from 'react';
import { Alert } from 'react-bootstrap';
import conf from './../../conf.json';
import errDict from './errorDictionary.json';
import classes from './Error.module.css';

const ErrorModal = (props) => {
  const errorMsg = errDict[props.errorMsg];
  return (
    <Alert className={classes['error']} variant='danger' onClose={props.handleCloseModal} dismissible>
      <Alert.Heading>Mamamia! You got an error!</Alert.Heading>
      <hr />
      <p>
        Error num: <b>{props.errorMsg}</b>
      </p>
      <i>{errorMsg} error</i>

      <hr />
      <div className='text-right'>
        Contact <b>{conf.CONTACT_EMAIL}</b>
      </div>
    </Alert>
  );
};

export default ErrorModal;
