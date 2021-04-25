import React, { useState } from "react";
import { Form, Row, Col, Modal, Button } from "react-bootstrap";
import DatePicker from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import firebase from '../../../../../../services/firebase';
import EvImages from "../../EvImages/EvImages";
import WaitIcon from "./../../../../../../util/Wait/Wait";
import { be_addEvent } from '../../../../../../services/Service';

const storageRef = firebase.storage().ref();
const Compress = require("compress.js");

const AddEventModal = (props) => {

  const [submit, setSubmit] = useState(false);
  const [dt, setDt] = useState(moment());
  const [location, set_location] = useState("");
  const [memo, set_memo] = useState("");
  const [getImagesToBeUploaded, setImagesToBeUploaded] = useState({});
  const [getLocalErrors, setLocalErrors] = useState({
    location: "",
    memo: "",
  });

  const compress = new Compress();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let errors = getLocalErrors;
    switch (name) {
      case "set_location":
        set_location(value);
        errors["location"] = value.length < 4 ? "שם מחלקה לא חוקית" : "";
        break;

      case "set_memo":
        set_memo(value);
        errors["memo"] = value.length < 4 ? "שם הערה לא חוקית" : "";
        break;

      default:
        console.log("Throw error");
    }
    setLocalErrors(errors);
  };

  const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  const submitEvent = (isRemove) => {
    if (validateForm(getLocalErrors)) {
      console.info("Valid Form");
      saveEvent(isRemove);
    } else {
      console.error("Invalid Form");
    }
  };

  const saveEvent = (isRemove) => {
    setSubmit(true);
    /* Try to upload all images */
    //TODO still need to create a process that checks it a real image and if somehting fails dont continue. Instead revert.
    const imagesExists = Object.keys(getImagesToBeUploaded).length > 0;
    if (imagesExists) {
      // Compress files
      var uploadImageCount = 0;
      Object.keys(getImagesToBeUploaded).map((id) => {
        let file = getImagesToBeUploaded[id];
        compress
          .compress([file], {
            size: 0.5, // the max size in MB, defaults to 2MB
            quality: 0.75, // the quality of the image, max is 1,
            maxWidth: 1024, // the max width of the output image, defaults to 1920px
            maxHeight: 1024, // the max height of the output image, defaults to 1920px
            resize: true, // defaults to true, set false if you do not want to resize the image width and height
          })
          .then((data) => {
            const img1 = data[0];
            const base64str = img1.data;
            const imgExt = img1.ext;
            const file = Compress.convertBase64ToFile(base64str, imgExt);
            uploadImage(file, id);
          });
        return null;
      });
    } else {
      updateDB();
    }
    const imageUploadOK = function () {
      uploadImageCount += 1;
      if (uploadImageCount >= Object.keys(getImagesToBeUploaded).length)
        updateDB();
    };

    /* Save Event */
    //TODO Have to recreate the images hash
    function updateDB() {
      const objImages = {};
      Object.keys(getImagesToBeUploaded).map((id) => {
        objImages[id] = id;
        return null;
      });

      const postData = {
        location: location,
        memo: memo,
        time: dt.toString(),
        removePatient: isRemove,
        images: objImages,
      };
      
      handleSaveEvent(postData);
    }

    async function handleSaveEvent(data) {
      await be_addEvent(
        props.defaultOrgID,
        props.userName,
        props.patientID,
        data,
        (res) => {
          //Respond OK
          setSubmit(false);

          props.handleCloseEventModal();
        },

        (err) => {
           props.handleSetError(16);
        }
      );
    }

    function uploadImage(file, name) {
      var uploadTask = storageRef
        .child(props.defaultOrgID + "/" + name)
        .put(file);
      uploadTask.on(
        "state_changed",
        function (snapshot) {
          //Showing progress: var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        function (error) {
           props.handleSetError(17);
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
      {submit === true ? <WaitIcon /> : null}
      <Modal show={true} onHide={props.handleCloseEventModal}>
        <Modal.Header closeButton className={'modalHebrew'}>
          <Modal.Title>הוספת אירוע</Modal.Title>
        </Modal.Header>
        <Modal.Body className='hebrew'>
          <Form>
            <Form.Group as={Row} controlId='location'>
              <Form.Label column sm='12'>
                מחלקה
              </Form.Label>
              <Col sm='12'>
                <Form.Control
                  type='text'
                  placeholder='מחלקת ...'
                  value={location}
                  name='set_location'
                  onChange={handleFormChange}
                />
                {getLocalErrors['location'].length > 0 && <div className='alertMsg'>{getLocalErrors['location']}</div>}
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId='date'>
              <Form.Label column sm='12'>
                תאריך + שעה
              </Form.Label>
              <Col sm='12'>
                <DatePicker
                  inputProps={{ readOnly: true }}
                  dateFormat='DD-MM-YYYY'
                  timeFormat='hh:mm'
                  value={dt}
                  name='set_date_time'
                  onChange={(val) => setDt(val)}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId='event_memo'>
              <Form.Label column sm={12}>
                הערה
              </Form.Label>
              <Col sm={12}>
                <Form.Control
                  as='textarea'
                  rows={3}
                  placeholder='הערה'
                  value={memo.value}
                  name='set_memo'
                  onChange={handleFormChange}
                />
                {getLocalErrors['memo'].length > 0 && <div className='alertMsg'>{getLocalErrors['memo']}</div>}
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={12}>
                צילומים
              </Form.Label>
              <Col sm={12}>
                <EvImages
                  key='0'
                  onImagesToBeUploadedChange={handleImagesToBeUploadedChanged}
                  orgID={props.orgID}
                  isEdit={true}
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='link' onClick={props.handleCloseEventModal}>
            סגור
          </Button>
          <Button variant='primary' onClick={() => submitEvent(false)} disabled={submit}>
            הוספת אירוע
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEventModal;
