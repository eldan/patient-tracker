import React from "react";
import classes from './Wait.module.css'
import {Modal} from "react-bootstrap";
import waitIcon from "./../../images/wait.gif";

const Wait = (props) => {
    
    return (
      <Modal show={true} animation={false}>
        <div className={classes["wait"]}>
          <div>
            <img
              alt="Processing"
              src={waitIcon}
              className={classes["waitIcon"]}
            />
          </div>
        </div>
      </Modal>
    );
}

export default Wait;
