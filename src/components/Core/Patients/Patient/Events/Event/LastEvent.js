import React from "react";
import classes from "./../../../Patients.module.css";
import { Row, Col } from "react-bootstrap";
const LastEvent = (props) => {
  return (
    <>
      <div className={classes["hr_white"]}></div>
      {props.location !== "" ? (
        <div className={classes["flex"]}>
          <span>
            <i
              className={["fas fa-map-marker-alt", classes["icon_light"]].join(
                " "
              )}
            ></i>
          </span>
          <span className={classes["location"]}>{props.location}</span>
        </div>
      ) : (
        ""
      )}


      {props.memo ? (
        <Row>
          <Col>
            <div className={classes["last_event_memo"]}>{props.memo}</div>
          </Col>
        </Row>
      ) : null}

      {/* PATIENT UPDATE TIME */}
      <div className={[classes["flex"], classes["smallerFont"]].join(" ")}>
        <span>
          <i className={["far fa-clock", classes["icon_light"]].join(" ")}></i>
        </span>
        <span>
          {props.time}
        </span>
      </div>



       {/* PATIENT AUTHOR DOCTOR*/}
     <div
          className={[classes["flex"], classes["smallerFont"]].join(" ")}
        >
          <span>
            <i
              className={["fas fa-stethoscope", classes["icon_light"]].join(
                " "
              )}
            ></i>
          </span>
          <span>
            {props.editor}
          </span>
        </div>
    </>

    
  );
};
export default LastEvent;
