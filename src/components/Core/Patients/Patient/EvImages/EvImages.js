import React, { useState, useEffect } from "react";
import { Container, Button, Image } from "react-bootstrap";
import imagePlaceHolder from "./../.././../../../images/imagePlaceHolder.gif";
import classes from "./EvImages.module.css";
import firebase from "./../../../../../Comm/firebase";

const EvImages = (props) => {
  const storageRef = firebase.storage().ref();
  const [evImages, setEVImages] = useState({});
  const [previewImages, setPreviewImages] = useState({});
  const [getEnlargedImages, setEnlargedImage] = useState(null);
  const [isModeEdit] = useState(props.isEdit);

  useEffect(() => {
    //console.log("EvImages > useEffect > Show 1st Time? ");
    // return () => {

    if (!isModeEdit) {
      const setImageUrl = (image) => {
        return new Promise((resolve) => {
          storageRef
            .child(`${image}`)
            .getDownloadURL()
            .then((url) => {
              // console.log("EvImages > useEffect > Show 3rd Time? ");
              // GET BACK url
              resolve(url);
            });
        });
      };

      if (props.images) {
        const arrImages = Object.values(props.images);
        var arrPromises = [];
        for (var i = 0; i < arrImages.length; i++) {
          arrPromises.push(setImageUrl(props.orgID + '/' + arrImages[i]));
        }

        Promise.all(arrPromises).then((results) => {
          setEVImages({ ...results });
        });
      }
    }
    // };
    return () => {
      // console.log("EvImages > useEffect > Show 2nd Time? ");
    };
  }, [props.isPatientDetailedAlreadyOpened]);

  const removeImage = (uid) => {
    var obj = { ...previewImages };
    delete obj[uid];
    setPreviewImages(obj);
    props.onImagesToBeUploadedChange(obj);
  };

  const enlargeImage = (url) => {
    setEnlargedImage(url);
  };

  function EvImage(prop) {
    const uid = prop.id;
    return (
      <div className={classes['previewImage']}>
        {isModeEdit ? (
          <Button variant='danger' size='sm' className={classes['remEvbutton']} onClick={() => removeImage(uid)}>
            -
          </Button>
        ) : null}
        <Image
          thumbnail
          style={{ height: '100%', cursor: 'pointer' }}
          src={prop.url}
          alt=''
          onClick={() => enlargeImage(prop.url)} />
      </div>
    );
  }
  const previewImageBeforeUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const fileName = Date.now() + Math.floor(Math.random() * 9999);
      setPreviewImages({ ...previewImages, [fileName]: event.target.files[0] });
      props.onImagesToBeUploadedChange({
        ...previewImages,
        [fileName]: event.target.files[0],
      });
    }
  };

  const AddEvImage = () => {
    return (
      <div className={classes['upload-btn-wrapper']}>
        <Button className={classes['addEvbutton']} variant='outline-primary'>
          +
        </Button>
        <input
          type='file'
          accept='image/*'
          name='myfile'
          onChange={previewImageBeforeUpload}
          className={classes['addEvbutton']}
        />
      </div>
    );
  };

  const DrawPreviewImagesBeforeUploading = () => {
    return Object.keys(previewImages).map((id) => (
      <EvImage key={id} id={id} url={URL.createObjectURL(previewImages[id])} />
    ));
  };

  const DrawEVImagesPlaceHolders = () => {
    // console.log("DrawEVImagesPlaceHolders");
    return Object.keys(evImages).map((id) => (
      <img key={id} src={imagePlaceHolder} alt='' />
    ));
  };

  const DrawEVImages = () => {
    return Object.keys(evImages).map((id) => <EvImage key={id} id={id} url={evImages[id]} />);
  };

  const DrawEnlargeImage = () => (
    <>
      <div className={classes['backDropForImage']} onClick={() => setEnlargedImage(null)}></div>
      <Image
        src={getEnlargedImages}
        alt=''
        onClick={() => setEnlargedImage(null)}
        className={classes['maximizeImage']}
      />
    </>
  );

  return (
    <>
      <Container style={{ paddingRight: '0px' }}>
        {getEnlargedImages !== null ? <DrawEnlargeImage /> : null}
        {isModeEdit ? (
          <>
            <DrawPreviewImagesBeforeUploading />
            <AddEvImage />
          </>
        ) : null}

        {props.tfShowImages === false ? <DrawEVImagesPlaceHolders /> : <DrawEVImages />}
      </Container>
    </>
  );
};

export default EvImages;
