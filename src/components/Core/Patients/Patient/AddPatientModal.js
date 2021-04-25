import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import DatePicker from "react-datetime";
import moment from "moment";
import "react-datetime/css/react-datetime.css";
import EvImages from "./EvImages/EvImages";
import WaitIcon from "./../../../../util/Wait/Wait";
import firebase from '../../../../services/firebase';

const storageRef = firebase.storage().ref();

const AddPatient = (props) => {
  const [submit, setSubmit] = useState(false);
  const [isrl_id, set_isrl_id] = useState("");
  const [medical_cause, set_medicalcause] = useState("");
  const [name, set_name] = useState("");
  const [age, set_age] = useState("");
  const [location, set_location] = useState("");
  const [month_year, set_month_year] = useState("ש׳");
  const [dt, setDt] = useState(moment());
  const [memo, set_memo] = useState("");
  const [getImagesToBeUploaded, setImagesToBeUploaded] = useState({});
  const [getLocalErrors, setLocalErrors] = useState({
    isrl_id: "",
    set_name: "",
    set_age: "",
    set_medicalcause: "",
    set_location: "",
    set_memo: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let errors = getLocalErrors;
    switch (name) {
      case "set_idcard":
        set_isrl_id(value);
        errors["isrl_id"] =
          value.length < 8 || !RegExp("^[0-9]") ? "8 ספרות" : "";
        break;

      case "set_name":
        set_name(value);
        errors["set_name"] = value.length < 2 ? "שם קצר מדי" : "";
        break;

      case "set_age":
        set_age(value);
        //  errors["set_age"] = value.length > 5 ? "גיל לא בפורמט נכון" : "";
        break;

      case "set_location":
        set_location(value);
        errors["set_location"] = value.length < 2 ? "שם מחלקה לא חוקית" : "";
        break;

      case "set_memo":
        set_memo(value);
        errors["set_memo"] = value.length < 2 ? "הערה קצרה מדי" : "";
        break;

      case "set_medicalcause":
        set_medicalcause(value);
        errors["set_medicalcause"] = value.length < 2 ? "נא לפרט" : "";
        break;

      default:
        console.log("Throw an error");
    }
    setLocalErrors(errors);
  };

  const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (validateForm) submitFormPart2();
  };
  const submitFormPart2 = () => {
    setSubmit(true);
    const postData = {
      isrl_id: isrl_id,
      name: name,
      age: age + ' ' + month_year,
      medical_cause: medical_cause,
      event: {
        //this node will be romove and pushed in 2nd phase
        location: location,
        time: dt.toString(),
        memo: memo,
        images: getImagesToBeUploaded,
      },
    };

    /* TODO THIS IS COPIED FROM SAME LOGIC AS IN AddEventModal, Refactor */

    const imagesExists = Object.keys(getImagesToBeUploaded).length > 0;
    if (imagesExists) {
      var uploadImageCount = 0;
      Object.keys(getImagesToBeUploaded).map((id) => {
        let file = getImagesToBeUploaded[id];
        uploadImage(file, id);
        return null;
      });
    } else {
      props.handleAddPatient(postData);
      setSubmit(false);
    }
    const imageUploadOK = function () {
      uploadImageCount += 1;
      //if (uploadImageCount >= Object.keys(getImagesToBeUploaded).length) updateDB();
      if (uploadImageCount >= Object.keys(getImagesToBeUploaded).length) {
        const objImages = {};
        Object.keys(getImagesToBeUploaded).map((id) => {
          objImages[id] = id;
          return null;
        });
        postData.event.images = objImages;
        props.handleAddPatient(postData);
      }
    };

    function uploadImage(file, name) {
      var uploadTask = storageRef.child(props.orgID + '/' + name).put(file);
      uploadTask.on(
        'state_changed',
        function (snapshot) {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        function (error) {
          // Handle unsuccessful uploads
          return false;
        },
        function () {
          // Handle successful uploads on complete
          imageUploadOK();
        }
      );
    }
  };

  const handleImagesToBeUploadedChanged = (images) => {
    setImagesToBeUploaded(images);
  };

  return (
    <>
      {submit && <WaitIcon />}
      <Modal show={true} onHide={props.handleCloseModalNewPatient} animation={true}>
        <Modal.Header closeButton className={'modalHebrew'}>
          <Modal.Title className='hebrew'>הוספת מטופל</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body className='hebrew'>
            <Form.Group as={Row} controlId='isr_id'>
              <Form.Label column sm='12'>
                מספר מקרה/קבלה
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  type='number'
                  placeholder='8 ספרות'
                  name='set_idcard'
                  value={isrl_id}
                  onChange={(e) => {
                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 8);
                    handleFormChange(e);
                  }}
                />
                {getLocalErrors['isrl_id'].length > 0 && <div className='alertMsg'>{getLocalErrors['isrl_id']}</div>}
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='name'>
              <Form.Label column sm='12'>
                שם מלא
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  type='text'
                  placeholder='פלוני אלמוני'
                  value={name.value}
                  name='set_name'
                  onChange={handleFormChange}
                />
                {getLocalErrors['set_name'].length > 0 && <div className='alertMsg'>{getLocalErrors['set_name']}</div>}
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='age'>
              <Form.Label column sm='12'>
                גיל
              </Form.Label>
              <Col sm='3'>
                <Form.Control
                  type='number'
                  placeholder=''
                  maxLength={5}
                  name='set_age'
                  value={age.value}
                  onChange={(e) => {
                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5);
                    handleFormChange(e);
                  }}
                />
                {getLocalErrors['set_age'].length > 0 && <div className='alertMsg'>{getLocalErrors['set_age']}</div>}
              </Col>
              <Col sm='9' className='mt-2'>
                <Form.Check
                  inline
                  name='my'
                  label='שנים'
                  type='radio'
                  id='1'
                  checked
                  onChange={(e) => set_month_year('ש׳')}
                />
                <Form.Check
                  name='my'
                  key='2'
                  inline
                  label='חודשים'
                  type='radio'
                  id='2'
                  onChange={(e) => set_month_year('ח׳')}
                />
              </Col>
            </Form.Group>
            <hr />
            <Form.Group as={Row} controlId='medical_cause'>
              <Form.Label column sm='12'>
                אבחנה רפואית
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  as='textarea'
                  rows={3}
                  placeholder=''
                  name='set_medicalcause'
                  value={set_medicalcause.value}
                  onChange={handleFormChange}
                />
                {getLocalErrors['set_medicalcause'].length > 0 && (
                  <div className='alertMsg'>{getLocalErrors['set_medicalcause']}</div>
                )}
              </Col>
            </Form.Group>
            <hr />

            <Form.Group as={Row} controlId='location'>
              <Form.Label column sm='12'>
                מחלקה
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  type='text'
                  placeholder='מחלקת...'
                  value={location.value}
                  name='set_location'
                  onChange={handleFormChange}
                />
                {getLocalErrors['set_location'].length > 0 && <div className='alertMsg'>{getLocalErrors['set_location']}</div>}
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='date'>
              <Form.Label column sm='12'>
                תאריך + שעה
              </Form.Label>
              <Col sm='10'>
                <DatePicker
                  inputProps={{ readOnly: true }}
                  dateFormat='DD-MM-YYYY'
                  timeFormat='hh:mm'
                  value={dt}
                  onChange={(val) => setDt(val)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='event_memo'>
              <Form.Label column sm='12'>
                הערה
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  as='textarea'
                  rows={3}
                  placeholder='הערה'
                  value={memo.value}
                  name='set_memo'
                  onChange={handleFormChange}
                />
                {getLocalErrors['set_memo'].length > 0 && <div className='alertMsg'>{getLocalErrors['set_memo']}</div>}
              </Col>
            </Form.Group>
            <Form.Group as={Row} style={{ paddingRight: '0' }}>
              <Form.Label column sm={12}>
                צילומים
              </Form.Label>
              <Col sm='12'>
                <EvImages
                  onImagesToBeUploadedChange={handleImagesToBeUploadedChanged}
                  orgID={props.orgID}
                  isEdit={true}
                />
              </Col>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='link' onClick={props.handleCloseModalNewPatient}>
              סגור
            </Button>
            <Button
              variant='primary'
              onClick={submitForm}
              disabled={submit}
              style={{ backgroundColor: 'rgb(29 72 119)' }}>
              הוספת מטופל
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddPatient;
