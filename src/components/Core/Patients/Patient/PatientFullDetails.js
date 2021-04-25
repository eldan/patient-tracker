import React, { useState } from 'react';
import PatientSummary from './../PatientSummary';
import Event from './Events/Event/Event';
import AddEventModal from './Events/Event/AddEventModal';
import classes from './../Patients.module.css';
import classes_archive from './../PatientsArchive.module.css';
import { Button, Modal, Alert } from 'react-bootstrap';
import WaitIcon from './../../../../util/Wait/Wait';

const PatientFullDetails = (props) => {

  const patient = props.patient;
  const [loading] = useState(false); // missing setLoading
  const [getClassAnimation, setClass] = useState('modalSwipIn');
  const [alertBeforDelete, setAlertBeforDelete] = useState(false);
  const [showModalEvent, setModalEvent] = useState(false);

  function ClassSelectorForArchive(className) {
    if (props.viewType === 'archive') {
      return classes_archive[className];
    } else return classes[className];
  }
  
  const DrawEvents = () => {
    const arr = Object.values(patient.events).reverse();
    const obj = [];
    let i;
    for (i = 0; i < arr.length; i++) {
      obj[i] = (
        <Event
          key={i}
          location={arr[i].location}
          memo={arr[i].memo}
          time={new Date(arr[i].time).toLocaleString()}
          editor={arr[i].editor}
          images={arr[i].images}
          defaultOrgID={props.defaultOrgID} // TODO move to general Context
          viewType={props.viewType} // TODO move to general Context
          includeImages={true}
        />
      );
    }
    return obj;
  };

  const MedicalCause = (props) => {
    return <div className={classes['medicalCause']}>{props.str}</div>;
  };

  const handleCloseModal = (e) => {
    setClass('modalSwipOut');
    setTimeout(() => {
      props.resetFocusPatient();
    }, 500);
  };

  const AlertBeforeDelete = () => (
    <Alert className='hebrew' variant='danger' onClose={() => setAlertBeforDelete(false)} dismissible>
      <Alert.Heading>זוהי פעולה ללא אפשרות שיחזור</Alert.Heading>
      <p>אפשר למחוק את כל נתוני החולה מהמערכת?</p>
      <div className='text-left'>
        <Button variant='outline-danger' onClick={() => setAlertBeforDelete(false)}>
          בטל
        </Button>
        <Button onClick={props.handleRemovePatient} variant='link' style={{ color: '#dc3545' }}>
          מחק
        </Button>
      </div>
    </Alert>
  );

  const DrawEventButtons = (patient) => {
    const rt =
      props.viewType !== 'archive' ? (
        <div className='text-right'>
          <Button variant='link' size='sm' style={{ float: 'left' }} onClick={() => setAlertBeforDelete(true)}>
            מחק חולה
          </Button>
          <Button variant='success' size='sm' className='mr-1' onClick={props.setPatientDeactive}>
            שחרור חולה
          </Button>
          <Button variant='primary' size='sm' onClick={() => setModalEvent(true)}>
            הוספת אירוע
          </Button>
        </div>
      ) : (
        <>
          <Button variant='link' size='sm' style={{ float: 'left' }} onClick={() => setAlertBeforDelete(true)}>
            מחק חולה
          </Button>
          <Button variant='success' size='sm' className='mr-1' onClick={props.setPatientActive}>
            החזר לרשימת החולים
          </Button>
        </>
      );
    return rt;
  };
  const handleCloseEventModal = () => {
    props.refreshGUI(true);
    setModalEvent(false);
  };

  return (
    <>
      {patient !== undefined && (
        <Modal
          show={true}
          onHide={handleCloseModal}
          animation={false}
          contentClassName={classes[getClassAnimation]}
        >
          <Modal.Header style={{ padding: '5px 0px 0px 0px' }}>
            <DrawEventButtons />
            <Button variant='link' onClick={handleCloseModal}>
              חזרה <i className='fas fa-chevron-right'></i>
            </Button>
          </Modal.Header>
          <div className={[classes['cardBox'], ClassSelectorForArchive('cardBoxFullDetails')].join(' ')}>
            {alertBeforDelete && <AlertBeforeDelete />}
            <PatientSummary patient={patient} />
            <MedicalCause str={patient.medical_cause} />
            <hr className={classes['hr']} />
            <DrawEvents />
          </div>
        </Modal>
      )}
      {showModalEvent && (
        <>
          <AddEventModal
            handleCloseEventModal={handleCloseEventModal}
            patientID={props.focusPatientID}
            defaultOrgID={props.defaultOrgID}
            userName={props.userName}
            handleSetError={(err) => props.handleSetError(err)}
          />
        </>
      )}
      {loading && <WaitIcon />}
    </>
  );
};
export default PatientFullDetails;
