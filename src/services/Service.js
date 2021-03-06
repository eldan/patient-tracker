import { db } from "./firebase";
//TODO add storage function as well
export const be_loadPatients = async (
  getDefaultOrgID,
  viewType,
  callBack,
  callBackError
) => {
  var ref = db.ref("patients/" + getDefaultOrgID);
  var queryUserActive = "active";
  if (viewType === "archive") queryUserActive = "deactive";
  try {
    ref
      .orderByChild("status")
      .equalTo(queryUserActive)
      .once("value", function (dataSnapshot) {
        if (dataSnapshot.toJSON() !== null) {
          callBack(dataSnapshot.toJSON());
        } else {
          callBack({});
        }
      });
  } catch (e) {
    callBackError(e);
  }
};

export const be_deletePatient = async (
  getDefaultOrgID,
  patientID,
  callBack,
  callBackError
) => {
  //Remove from DB
  try {
    const ref = db.ref("patients/" + getDefaultOrgID + "/" + patientID);
    ref.set(null);
    callBack(true);
  } catch (err) {
    callBackError(err.toString());
  }
};

export const be_addPatient = async (
  getDefaultOrgID,
  userName,
  data,
  callBack,
  callBackError
) => {
  data.status = "active";
  data.events = true;
  var eventToBePushed = data.event;
  eventToBePushed.action = "userActivate";
  delete data.event;
  try {
    var reff1 = db.ref("patients/" + getDefaultOrgID);
    var reff2 = reff1.push();
    reff2.set(data, function (error) {
      if (error) {
        callBackError(error);
      } else {
        be_addEvent(
          getDefaultOrgID,
          userName,
          reff2.getKey(),
          eventToBePushed,
          callBack,
          callBackError
        );
      }
    });
  } catch (e) {
    callBackError(e);
  }
};

export const be_addEvent = async (
  getDefaultOrgID,
  userName,
  patientID,
  data,
  callBack,
  callBackError
) => {
  var toBeRemoved = false;
  var rebringPatient = false;
  if (data.removePatient) {
    toBeRemoved = true;
    data.location = "שוחרר";
    data.action = "userDeactivate";
  }
  if (data.rebringPatient) {
    rebringPatient = true;
    data.location = "הוחזר למערכת";
    data.action = "userReactivate";
  }

  delete data.removePatient;
  delete data.rebringPatient;
  data.editor = userName;

  try {
    var reff = db.ref(
      "patients/" + getDefaultOrgID + "/" + patientID + "/events"
    );
    reff.push().set(data, function (error) {
      if (error) {
        callBackError(error);
      } else {
        if (toBeRemoved) {
          be_setPatientDeactive(
            getDefaultOrgID,
            patientID,
            callBack,
            callBackError
          );
        } else {
          callBack(true);
        }
        if (rebringPatient) {
          be_setPatientActive(
            getDefaultOrgID,
            patientID,
            callBack,
            callBackError
          );
        } else {
          callBack(true);
        }
      }
    });
  } catch (e) {
    callBackError(e);
  }
};

//TODO instead of callBack(true) -> {res:202} dont remember the num
const be_setPatientDeactive = async (
  getDefaultOrgID,
  patientID,
  callBack,
  callBackError
) => {
  try {
    var ref = db.ref(
      "patients/" + getDefaultOrgID + "/" + patientID + "/status"
    );
    ref.set("deactive", function (error) {
      if (error) {
        callBackError(error);
      } else {
        //Set memo to release
        callBack(true);
      }
    });
  } catch (e) {}
};

const be_setPatientActive = async (
  getDefaultOrgID,
  patientID,
  callBack,
  callBackError
) => {
  try {
    var ref = db.ref(
      "patients/" + getDefaultOrgID + "/" + patientID + "/status"
    );
    ref.set("active", function (error) {
      if (error) {
        callBackError(error);
      } else {
        callBack(true);
      }
    });
  } catch (e) {
    callBackError(e);
  }
};
