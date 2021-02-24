import React, { useEffect } from "react";

import axios from "axios";

const loadOrgs = () => {
  axios
    .get(`https://patient-tracker-8a957.firebaseio.com/organisation.json`)
    .then((res) => {
      if (res.data) {
        let objects = [];
        Object.keys(res.data).map((id) => {
          objects[id] = res.data[id];
          return true;
        });
      }
    });
};

const ManageOrgs = () => {
  useEffect(() => {
    loadOrgs();
  }, []);

  return <h1>ManageOrgs</h1>;
};

export default ManageOrgs;
