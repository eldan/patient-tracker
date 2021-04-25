import React, { useState } from "react";
import classesContent from "./Content.module.css";
import Patients from "./Patients/Patients";
import Search from "./Patients/Search";

const Content = (props) => {
  
  const [getSearchIsrl_ID, setSearchIsrl_ID] = useState("");
  const FSetSearchIsrl_ID = (value) => setSearchIsrl_ID(value);

  return (
    <>
      <div className={classesContent['search']}>
        <Search FSetSearchIsrl_ID={FSetSearchIsrl_ID} />
      </div>
      {/* PATIENT LIST */}
      <div
        className={classesContent['patients']}
        style={{ paddingTop: props.location === 'archive' ? '95px' : '130px' }}>
        <Patients
          searchCriteria={getSearchIsrl_ID}
          viewType={props.location}
          handleSetError={(err) => props.handleSetError(err)}
        />
      </div>
    </>
  );
};

export default Content;
