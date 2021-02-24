import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";

 function openPage (){
    const url = 'http://eldanet.com';
    window.open(url, '_blank');
}
const About = () => (
  <Jumbotron>
    <br/>
    <br/>
    <h1>Patient Tracker v 2.0</h1>
    <p>
      Build by <b>Eldanet.com</b>
      <br />
      If you have any questions/bugs please send an email to: info@eldanet.com
    </p>
    <p>
      <Button variant="primary" onClick={openPage}>
        Learn more
      </Button>
    </p>
  </Jumbotron>
);
export default About;