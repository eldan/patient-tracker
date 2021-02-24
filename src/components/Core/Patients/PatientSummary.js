import React from "react";
import { Row, Col } from "react-bootstrap";
import classes from "./Patients.module.css";



const PatientSummary = (props) => {
   const patient = props.patient;
  //  const id = props.id;
   return (
     <>
       <Row>
         <Col>
           <div
             className={[
               classes["flex"],
               classes["cardTop"],
               classes["cardAge"],
             ].join(" ")}
             style={{ float: "left" }}
           >
             <span>גיל</span>
             <span
               style={{
                 width: "100%",
                 textAlign: "left",
                 direction: "rtl",
               }}
             >
               {patient.age}
             </span>
           </div>
         </Col>
         <Col xs={6}>
           <div className={[classes["flex"], classes["cardTop"]].join(" ")}>
             <span>
               <i
                 className={["far fa-id-card", classes["icon_light"]].join(" ")}
               ></i>
             </span>
             <span>{patient.isrl_id}</span>
             <span>...</span>
           </div>
         </Col>
       </Row>

       {/* PATIENT NAME */}
       <div className={classes["flex"]}>
         <span></span>
         <span className={classes["patient_name"]}>{patient.name}</span>
       </div>

       {/* MEDICAL CAUSE */}
       {patient.medical_cause !== undefined ? (
         <div className={classes["flex"]}>
           <span>
             <i
               className={["fas fa-notes-medical", classes["icon_light"]].join(
                 " "
               )}
             ></i>
           </span>
           <span className={classes["medical_cause"]}>
             {patient.medical_cause}
           </span>
         </div>
       ) : (
         ""
       )}
     </>
   );
}
export default PatientSummary;