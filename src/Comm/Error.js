import React from "react";
import Alert from "react-bootstrap/Alert";

const Error = (props) => {

    return (
      <Alert variant="danger" onClose={() => props.setError(false)} dismissible>
        <Alert.Heading>Mamamia! You got an error!</Alert.Heading>
        <p>
          {props.errorMsg}.<br />
          Contact Eldan - he is the guy who built this app, he will solve the
          problem.
        </p>
      </Alert>
    );
  }



export default Error;