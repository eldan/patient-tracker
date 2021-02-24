import React, { useState } from "react";
import classesContent from "./Content.module.css";
import Patients from "./Patients/Patients";
// import AddPatient from "./Patients/Patient/AddPatient";
import Search from "./Patients/Search";

const Content = (props) => {
  //SEARCH STUFF
  //const [resetSearch, SetResetSearch] = useState(false);
  const [getSearchIsrl_ID, setSearchIsrl_ID] = useState("");
  const FSetSearchIsrl_ID = (value) => setSearchIsrl_ID(value);

  // const resetSearchCriteria = () => {
  //   SetResetSearch(true);
  // }


  return (
    <>

      <div className={classesContent["search"]}>
        <Search
          FSetSearchIsrl_ID={FSetSearchIsrl_ID}
          // reset={resetSearch}
        />
      </div>

      {/* PATIENT LIST */}
      <div
        className={classesContent["patients"]}
        style={{ paddingTop: props.location === "archive" ? "95px" : "130px" }}
      >
        <Patients
          searchCriteria={getSearchIsrl_ID}
          // resetSearchCriteria={resetSearchCriteria}
          viewType={props.location}
        />
      </div>
    </>
  );
};

export default Content;
