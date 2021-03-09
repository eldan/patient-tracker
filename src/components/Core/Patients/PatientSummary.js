import React from "react";
import { Row, Col } from "react-bootstrap";
import classes from "./Patients.module.css";

const PatientSummary = (props) => {
   const patient = props.patient;
   
   return (
     <>
       <Row>
         <Col xs={6}>
           <div className={classes["patientAge"]}>{patient.age}</div>
         </Col>
         <Col xs={6}>
           <div className={classes["patientID"]}>...{patient.isrl_id}</div>
         </Col>
       </Row>

       {/* PATIENT NAME */}
         <div className={classes["patientName"]}>{patient.name}</div>
     </>
   );
}
export default PatientSummary;