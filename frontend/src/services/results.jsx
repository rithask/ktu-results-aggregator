import axios from "axios";

const baseUrl = "/api/results";

const getResults = (registerNo, dob) => {
  const data = { registerNo, dob };
  return axios.post(baseUrl, data);
};

const updateResults = (registerNo, dob, semester, examDefId, oldResult) => {
  const data = { registerNo, dob, semester, examDefId, oldResult };
  return axios.post(`${baseUrl}/update`, data);
};

export default { getResults, updateResults };
