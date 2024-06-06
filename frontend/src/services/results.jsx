import axios from "axios";

const baseUrl = "/api/results";

const getResults = (registerNo) => {
  const data = { registerNo };
  return axios.post(baseUrl, data);
};

const updateResults = (registerNo, semester, examDefId, oldResult) => {
  const data = { registerNo, semester, examDefId, oldResult };
  return axios.post(`${baseUrl}/update`, data);
};

export default { getResults, updateResults };
