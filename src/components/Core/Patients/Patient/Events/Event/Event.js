import React from "react";
import classes from "./../../../Patients.module.css";
import classes_archive from "./../../../PatientsArchive.module.css";
import EvImages from "./../../EvImages/EvImages";
import { Row, Col } from "react-bootstrap";

const Event = (props) => {
  const includeImages = props.includeImages ? true : false;
  
  function ClassSelectorForArchive(className) {
    if (props.viewType === "archive") {
      return classes_archive[className];
    } else return classes[className];
  }
  return (
    <>
      <div className={classes['boxEvent']}>
        {props.location !== '' && <div className={ClassSelectorForArchive('location')}>{props.location}</div>}
        <Row>
          <Col className='pr-4'>
            <div className={classes['author']}>{props.editor}</div>
          </Col>
          <Col className='pl-3'>
            <div className={classes['date']}>{props.time}</div>
          </Col>
        </Row>

        {props.memo && (
          <Row>
            <Col className='pr-4'>
              <div className={classes['memo']}>{props.memo}</div>
            </Col>
          </Row>
        )}

        {includeImages && props.images && (
          <div className='pr-1'>
            <EvImages images={props.images} orgID={props.defaultOrgID} isEdit={false} isOpenedPatient={false} />
          </div>
        )}
      </div>
    </>
  );
};
export default Event;
