import React from "react";
import classes from "./../../../Patients.module.css";
import classes_archive from "./../../../PatientsArchive.module.css";
import EvImages from "./../../EvImages/EvImages";

const Event = (props) => {
  function ClassSelectorForArchive(className) {
    if (props.viewType === "archive") {
      return classes_archive[className];
    } else return classes[className];
  }
  return (
    <>
      <div className={classes["box"]}>
        {props.location !== "" ? (
          <div
            className={[
              classes["flex"],
              ClassSelectorForArchive("boxEvent"),
            ].join(" ")}
          >
            <span>
              <i
                className={["fas fa-map-marker-alt", classes["icon_dark"]].join(
                  " "
                )}
              ></i>
            </span>
            <span className={classes["location"]}>{props.location}</span>
          </div>
        ) : null}

        {/* MEMO */}
        {props.memo ? (
          <div
            className={[
              classes["flex"],
              ClassSelectorForArchive("boxEvent"),
            ].join(" ")}
          >
            <span>
              <i
                className={["far fa-clipboard", classes["icon_dark"]].join(" ")}
              ></i>
            </span>
            <span className={classes["event"]}>{props.memo}</span>
          </div>
        ) : null}

        {/* IMAGES */}
        {props.images ? (
          <div
            className={[
              classes["flex"],
              ClassSelectorForArchive("boxEvent"),
            ].join(" ")}
          >
            <span>
              <i
                className={["fas fa-camera", classes["icon_dark"]].join(" ")}
              ></i>
            </span>

            <span className={classes["event"]} style={{ lineHeight: "5px" }}>
              <EvImages
                images={props.images}
                orgID={props.defaultOrgID}
                isEdit={false}
                isOpenedPatient={false}
                // isPatientDetailedAlreadyOpened only when patient is open, prevent loading all images
                // isPatientDetailedAlreadyOpened={
                //   isPatientDetailedAlreadyOpened[p.patientID] === true
                //     ? true
                //     : false
                // }
              />
            </span>
          </div>
        ) : null}

        <div
          className={[
            classes["flex"],
            ClassSelectorForArchive("boxEvent"),
            classes["smallerFont"],
          ].join(" ")}
        >
          <span>
            <i className={["far fa-clock", classes["icon_dark"]].join(" ")}></i>
          </span>
          <span>{props.time}</span>
        </div>
        <div
          className={[
            classes["flex"],
            ClassSelectorForArchive("boxEvent"),
            classes["smallerFont"],
          ].join(" ")}
        >
          {" "}
          <span>
            {" "}
            <i
              className={["fas fa-stethoscope", classes["icon_light"]].join(
                " "
              )}
            ></i>
          </span>
          <span>{props.editor}</span>
        </div>
      </div>
    </>
  );
};
export default Event;
