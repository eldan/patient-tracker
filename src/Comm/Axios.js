import axios from "axios";

export default axios.create({
  baseURL: "https://patient-tracker-8a957.firebaseio.com",
  // headers: {
  //   "Content-type": "multipart/form-data",
  // },
});
