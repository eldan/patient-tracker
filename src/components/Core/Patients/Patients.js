import React, { useState, useEffect } from 'react';

import { Button, Container } from 'react-bootstrap';

import AddPatientModal from './Patient/AddPatientModal';
import PatientFullDetails from './Patient/PatientFullDetails';
import PatientSummary from './PatientSummary';
import Event from './Patient/Events/Event/Event';
import WaitIcon from '../../../util/Wait/Wait';
import { be_loadPatients, be_deletePatient, be_addPatient, be_addEvent } from '../../../services/Service';

import classes_archive from './PatientsArchive.module.css';
import classes from './Patients.module.css';
import 'react-datetime/css/react-datetime.css';

import { useAuth } from './../../../contexts/AuthContext';
import firebase from './../../../services/firebase';

const Patients = (props) => {
  
  const [patients, setPatients] = useState({});
  const [filteredPatients, setFilteredPatients] = useState({});
  const [focusPatientID, setFocusPatientID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setModal] = useState(false);
  const [allowUItoRefresh, setAllowUItoRefresh] = useState(true);
  const { getUserFullName, getDefaultOrgID } = useAuth();
  const userName = getUserFullName;
  const storageRef = firebase.storage().ref();

  const handleCloseModalNewPatient = () => setModal(false);

  const handleOpenModalNewPatient = (e) => {
    setModal(true);
  };

  const resetFocusPatient = () => {
    setFocusPatientID(null);
  };

  useEffect(() => {
    // Reload data when changing Organization or to/from Archive

    loadPatients();    
    // const abortController = new AbortController();
    // const signal = abortController.signal;
    // loadPatients({signal:signal});
    // return function cleanup(){
    //   abortController.abort();
    // }
  }, [getDefaultOrgID, props.viewType]);

  useEffect(() => {
    // Change filtered result when patient or search is changing
    if (Object.values(patients).length >= 0 && allowUItoRefresh) {
      const newPatients = {};
      Object.keys(patients).map((id) => {
        if (patients[id].isrl_id.includes(props.searchCriteria)) {
          newPatients[id] = patients[id];
        }
        return null;
      });
      setFilteredPatients(newPatients);
    }
    if (!allowUItoRefresh) {
      const timer = setTimeout(() => {
        loadPatients();

        setAllowUItoRefresh(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [patients, props.searchCriteria, allowUItoRefresh]);

  async function setPatientDeactive() {
    setAllowUItoRefresh(false);
    const tmpFocusPatientID = focusPatientID;
    resetFocusPatient();
    setLoading(true);
    const data = {
      editor: getUserFullName,
      time: new Date().toString(),
      removePatient: true,
    };
    await be_addEvent(
      getDefaultOrgID,
      getUserFullName,
      tmpFocusPatientID,
      data,
      (res) => {
        //Respond OK
      },
      (err) => {
        props.handleSetError(11);
      }
    );
  }

  async function setPatientActive() {
    setAllowUItoRefresh(false);
    const tmpFocusPatientID = focusPatientID;
    resetFocusPatient();
    setLoading(true);
    const data = {
      editor: getUserFullName,
      time: new Date().toString(),
      rebringPatient: true,
    };

    await be_addEvent(
      getDefaultOrgID,
      getUserFullName,
      tmpFocusPatientID,
      data,
      (res) => {
        //Respond OK
      },
      (err) => {
        props.handleSetError(12);
      }
    );
  }

  //TODO use async for chainning methods
  async function handleRemovePatient() {
    
    Object.values(patients).map((patient) => {
      Object.values(patient.events).map((event) => {
        if (event.images) {
          Object.values(event.images).map((image) => {
            // Create a reference to the file to delete
            const path = getDefaultOrgID + '/' + image;
            var ref = storageRef.child(path);
            // Delete the file
            ref
              .delete()
              .then(() => {
                // File deleted successfully
              })
              .catch((error) => {
                props.handleSetError(14);
              });
          });
          return null;
        }
        return null;
      });
      return null;
    });
    setAllowUItoRefresh(false);
    const pid = focusPatientID; //need temporary id if not setFocusPatientID will reset the data and error will occure
    setFocusPatientID(null);
    await be_deletePatient(
      getDefaultOrgID,
      pid,
      (res) => {
        //Respond OK
      },
      (err) => {
        props.handleSetError(13);
      }
    );
  }

  async function savePatient(data) {
    await be_addPatient(
      getDefaultOrgID,
      userName,

      data,
      (res) => {
        //Respond OK
        closeAllModalAndResetData();
      },

      (err) => {
        closeAllModalAndResetData();
        props.handleSetError(15);
      }
    );
  }

  async function loadPatients() {
    setLoading(true);
    await be_loadPatients(
      getDefaultOrgID,
      props.viewType,
      (res) => {
        //Respond OK
        setPatients(res);
        setLoading(false);
      },
      (err) => {
        props.handleSetError(20);
        setLoading(false);
      }
    );
  }

  const closeAllModalAndResetData = () => {
    handleCloseModalNewPatient();
    loadPatients();
    setLoading(false);
  };

  function ClassSelectorForArchive(className) {
    if (props.viewType === 'archive') {
      return classes_archive[className];
    } else return classes[className];
  }

  const DrawPatients = React.memo(() => {
    const getLastPatientEvent = (person, property) => {
      //TODO Refactor: this is redone for each name which is bad, should be done and only after, get the name
      let lastElement;
      for (lastElement in person.events);

      var tmp;
      try {
        tmp = person.events[lastElement][property];
      } catch (e) {
        tmp = '';
      }
      return tmp;
    };

    const handlePatientDetail = (patientID) => {
      setFocusPatientID(patientID);
    };

    const MedicalCause = (props) => {
      return <div className={classes['medicalCause']}>{props.str}</div>;
    };

    return Object.keys(filteredPatients).map((id) => (
      <div
        className={ClassSelectorForArchive('cardBox')}
        key={id}
        as={Button}
        variant='link'
        onClick={() => handlePatientDetail(id)}>
        <PatientSummary patient={filteredPatients[id]} />
        <div className={classes['lastUpdateText']}>
          <MedicalCause str={filteredPatients[id].medical_cause} />
          <hr className={classes['hr']} />
          {Object.keys(filteredPatients[id].events).length > 1 ? (
            <div className={ClassSelectorForArchive('countEvents')}>
              {Object.keys(filteredPatients[id].events).length} אירועים
            </div>
          ) : (
            <div className={ClassSelectorForArchive('countEvents')}>אירוע אחד</div>
          )}
        </div>

        <Event
          key={id}
          location={getLastPatientEvent(filteredPatients[id], 'location')}
          editor={getLastPatientEvent(filteredPatients[id], 'editor')}
          memo={getLastPatientEvent(filteredPatients[id], 'memo')}
          time={new Date(getLastPatientEvent(filteredPatients[id], 'time')).toLocaleString()}
          viewType={props.viewType}
        />
      </div>
    ));
  });
  const refreshGUI = (tf) => {
    if (tf) loadPatients();
  };

  return (
    <>
      <div className={focusPatientID}>
        {focusPatientID !== null && (
          <PatientFullDetails
            handleSetError={(err) => props.handleSetError(err)}
            defaultOrgID={getDefaultOrgID}
            focusPatientID={focusPatientID}
            userName={getUserFullName}
            patient={filteredPatients[focusPatientID]}
            resetFocusPatient={resetFocusPatient} //will automatically close window
            setPatientActive={setPatientActive}
            setPatientDeactive={setPatientDeactive}
            handleRemovePatient={handleRemovePatient}
            viewType={props.viewType}
            refreshGUI={(tf) => refreshGUI(tf)}
          />
        )}

        {/* ---Archive--- */}
        {props.viewType === 'archive' ? null : (
          <div className='text-center'>
            <Button
              variant='primary'
              size='sm'
              style={{
                backgroundColor: '#0062cc',
                height: '35px',
                width: '-webkit-fill-available',
                margin: '3px 8px 0px 8px',
              }}
              onClick={handleOpenModalNewPatient}>
              הוספת מאושפז <i className='fas fa-user-plus'></i>
            </Button>
          </div>
        )}

        {props.viewType === 'archive' && <h1 className='text-center'>ארכיון</h1>}
        <Container className={classes['container']} fluid>
          {showModal && (
            <AddPatientModal
              handleCloseModalNewPatient={handleCloseModalNewPatient}
              handleAddPatient={savePatient}
              orgID={getDefaultOrgID}
            />
          )}
          <DrawPatients />
        </Container>
      </div>
      {loading && <WaitIcon />}
    </>
  );
};

export default Patients;
