import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import packageJson from './../package.json';
import conf from './conf.json';

function openPage() {
  window.open(conf.CONTACT_HTTP_URL, '_blank');
}
const About = () => (
  <Jumbotron>
    <h1 className='pt-5'>Patient Tracker v {packageJson.version}</h1>

    <p>
      Build by <b>{conf.CONTACT_COMPANY}</b>
      <br />
      If you have any questions, request or bugs, please contact: <b>{conf.CONTACT_EMAIL}</b>
    </p>
    <p>
      <Button variant='primary' onClick={openPage}>
        Eldanet.com
      </Button>
    </p>
  </Jumbotron>
);
export default About;
