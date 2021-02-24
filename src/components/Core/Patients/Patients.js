import React, { useState, useEffect } from "react";
import { Accordion, Card, Button, Container } from "react-bootstrap";
import AddPatientModal from "./Patient/AddPatientModal";
import PatientSummary from "./PatientSummary";
import AddEventModal from "./Patient/Events/Event/AddEventModal";
import Event from "./Patient/Events/Event/Event";
import LastEvent from "./Patient/Events/Event/LastEvent";
import WaitIcon from "../../../util/Wait/Wait";
import {
  be_loadPatients,
  be_deletePatient,
  be_setPatientActive,
  be_addEvent,
  be_addPatient,
} from "./../../../Comm/Backend";

import classes_archive from "./PatientsArchive.module.css";
import classes from "./Patients.module.css";
import "react-datetime/css/react-datetime.css";

import { useAuth } from "./../../../contexts/AuthContext";

import Error from "./../../../Comm/Error"; // TODO not realy doing this - should put inside good infra

const Patients = (props) => {
  // isPatientDetailedWhereOpened is for the images

  // const [
  //   isPatientDetailedAlreadyOpened,
  //   setPatientDetailedAlreadyOpened,
  // ] = useState({});

  const [patients, setPatients] = useState({});
  const [filteredPatients, setFilteredPatients] = useState({});

  const [focusPatientID, setFocusPatientID] = useState(null);

  const { getUserFullName, getDefaultOrgID } = useAuth();
  const userName = getUserFullName;

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setModal] = useState(false);
  const [showModalEvent, setModalEvent] = useState(false);
  const handleCloseModalNewPatient = () => setModal(false);

  const handleOpenModalNewPatient = (e) => {
    setModal(true);
  };
  const handleCloseModalNewEvent = () => {
    setModalEvent(false);
  };
  const handleOpenModalNewEvent = (patientID) => {
    setFocusPatientID(patientID);
    setModalEvent(true);
  };

  useEffect(() => {
    console.log("Patients > useEffect 1");
    loadPatients();
  }, [getDefaultOrgID, props.viewType]);

  // useEffect After patients change. Event change /  add Patient or when search is changed
  useEffect(() => {
    console.log("Patients > useEffect 2");
    if (patients !== null) {
      const newPatients = {};
      Object.keys(patients).map((id) => {
        if (patients[id].isrl_id.includes(props.searchCriteria)) {
          newPatients[id] = patients[id];
        }
        return null;
      });
      setFilteredPatients(newPatients);
    }
  }, [patients, props.searchCriteria]);

  //TODO use async for chaining methods
  async function handleRemovePatient(patientID) {
    await be_deletePatient(
      getDefaultOrgID,
      patientID,
      (res) => {
        //Respond OK
      },

      (err) => {
        //Respond Error
        setError(err);
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
        //Respond Error
        closeAllModalAndResetData();
        setError(err);
      }
    );
  }

  async function saveEvent(patientID, data) {
    await be_addEvent(
      getDefaultOrgID,
      userName,
      patientID,
      data,
      (res) => {
        //Respond OK
        closeAllModalAndResetData();
      },

      (err) => {
        //Respond Error
        setError(err);
        closeAllModalAndResetData();
      }
    );
  }

  async function setPatientActive(patientID) {
    setLoading(true);
    await be_setPatientActive(
      getDefaultOrgID,
      patientID,
      (res) => {
        //Respond OK
        closeAllModalAndResetData();
      },
      (err) => {
        //Respond Error
        setError(err);
        closeAllModalAndResetData();
      }
    );
  }

  async function loadPatients() {
    console.log("loadPatients");
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
        //Respond Error
        setError(err);
        setLoading(false);
      }
    );
  }

  const closeAllModalAndResetData = () => {
    handleCloseModalNewEvent();
    handleCloseModalNewPatient();
    loadPatients();
    setLoading(false);
  };

  function ClassSelectorForArchive(className) {
    if (props.viewType === "archive") {
      return classes_archive[className];
    } else return classes[className];
  }

  const DrawPatients = React.memo(() => {
    const getLastPatientEvent = (person, property) => {
      //TODO this is redone for each name which is bad, should be done and only after, get the name
      let lastElement;
      for (lastElement in person.events);

      var tmp;
      try {
        tmp = person.events[lastElement][property];
      } catch (e) {
        tmp = "";
      }
      return tmp;
    };

    const handlePatientDetail = (patientID) => {
      // if (isPatientDetailedAlreadyOpened[patientID] === undefined) {
      //   setPatientDetailedAlreadyOpened({
      //     ...isPatientDetailedAlreadyOpened,
      //     [patientID]: true,
      //   });
      // }
      setFocusPatientID(patientID);
    };

    return Object.keys(filteredPatients).map((id) => (
      <Card key={id} className={classes["cardBox"]}>
        <Card.Header className={ClassSelectorForArchive("cardheader")}>
          <Accordion.Toggle
            id={id}
            as={Button}
            variant="link"
            eventKey={"a_" + id}
            className={classes["cardheaderbutton"]}
            onClick={() => handlePatientDetail(id)}
          >
            <PatientSummary patient={filteredPatients[id]} />

            {/* Last Event Details */}
            <LastEvent
              location={getLastPatientEvent(filteredPatients[id], "location")}
              editor={getLastPatientEvent(filteredPatients[id], "editor")}
              memo={[Object.keys(filteredPatients[id].events).length - 1].memo}
              time={new Date(
                getLastPatientEvent(filteredPatients[id], "time")
              ).toLocaleString()}
            />
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey={"a_" + id}>
          <Card.Body className={classes["card"]}>
            <DrawEventButtons id={id} />
            { focusPatientID===id ?  <DrawEvents events={filteredPatients[id].events} patientID={id} /> : null}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    ));
  });

  const DrawEventButtons = (patient) => {
    const rt =
      props.viewType !== "archive" ? (
        <Button
          className={classes["buttonAddEvent"]}
          onClick={() => handleOpenModalNewEvent(patient.id)}
        >
          הוספת אירוע
        </Button>
      ) : (
        <>
          <Button
            variant="link"
            className={classes["buttonAddEventArchive"]}
            onClick={() => setPatientActive(patient.id)}
          >
            החזר לרשימת החולים
          </Button>
          <Button
            variant="danger"
            onClick={() => handleRemovePatient(patient.id)}
          >
            מחק חולה
          </Button>
        </>
      );
    return rt;
  };

  const DrawEvents = (p) => {
    const arr = Object.values(p.events).reverse();
    const obj = [];
    let i;
    for (i = 0; i < arr.length; i++) {
      obj[i] = (
        <Event
          key={i}
          location={arr[i].location}
          memo={arr[i].memo}
          time={arr[i].time}
          editor={arr[i].editor}
          images={arr[i].images}
          defaultOrgID={getDefaultOrgID}
        />
      );
    }
    return obj;
  };

  return (
    <>
      {/* <Search FSetSearchIsrl_ID={FSetSearchIsrl_ID} /> */}
      {error ? <Error setError={setError} errorMsg={error} /> : null}
      {loading ? <WaitIcon /> : null}
      {props.viewType === "archive" ? null : (
        <Button
          variant="primary"
          style={{ backgroundColor: "#0062cc" }}
          onClick={handleOpenModalNewPatient}
          block
        >
          הוספת מטופל
        </Button>
      )}
      {showModalEvent ? (
        <AddEventModal
          handleCloseModal={handleCloseModalNewEvent}
          handleAddEvent={saveEvent}
          patientID={focusPatientID}
          orgID={getDefaultOrgID}
          // isPatientDetailedAlreadyOpened={
          //   isPatientDetailedAlreadyOpened[focusPatientID]
          // }
        />
      ) : null}

      {props.viewType === "archive" ? (
        <h1 className="text-center">Archive</h1>
      ) : null}

      <Container className={classes["container"]} fluid>
        {showModal ? (
          <AddPatientModal
            handleCloseModalNewPatient={handleCloseModalNewPatient}
            handleAddPatient={savePatient}
            orgID={getDefaultOrgID}
          />
        ) : null}

        <Accordion>
          <DrawPatients />
        </Accordion>
      </Container>
    </>
  );
};

export default Patients;
