import React from "react";
import classes from './Wait.module.css'
import waitIcon from "./../../images/wait.gif";

const Wait = (props) => {
    
    return (
      <div className={classes["wait"]}>
        <div>
          <img
            alt="Processing"
            src={waitIcon}
            className={classes["waitIcon"]}
          />
        </div>
      </div>
    );

    
}

export default Wait;
