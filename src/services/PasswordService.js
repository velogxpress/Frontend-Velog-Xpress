import api from "./api";

export const updatePassword = (code,Client) => api.put(`/getupdatepassword/${code}`, Client, {headers: {"Content-Type": "application/json",},});
  
  