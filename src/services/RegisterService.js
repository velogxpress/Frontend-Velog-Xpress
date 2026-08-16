import api from "./api";

export const createClient = (Client) =>
  api.post("/clientregister", Client, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  export const createUtilisateur = (Client) =>
  api.post("/clientregister/newutilisateur", Client, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export const listClients = (page) =>
  api.get(`/clientregister?page=${page}&size=9&sort=id,desc`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  export const listAllClients = (page) =>
  api.get(`/clientregister?page=${page}&size=9999999&sort=id,desc`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  export const listAgents = (page) =>
  api.get(`/clientregister/user?page=${page}&size=100&sort=id,desc`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  export const rechercherClients = (param,page) =>
  api.get(`/clientregister/user/${param}?page=${page}&size=9&sort=id,desc`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
export const getClient = (ClientId) =>
  api.get(`/clientregister/${ClientId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  export const countClient = () => api.get(`/clientregister/countclient`, { headers: { "Content-Type": "application/json", }, });

  export const countClientCity = () =>
  api.get(`/clientregister/countclientcity`, {
    headers: {
      "Content-Type": "application/json",
    },});
export const updateClient = (code,client) =>api.put(`clientregister/${code}`, client, {headers: {"Content-Type": "application/json",},});
export const updateUtilisateur = (code, client) => api.put(`clientregister/${code}`, client);
     
export const updateUser = (code, client) => api.put(`clientregister/edituser/${code}`, client);
export const deleteClient = (ClientId) => api.delete(`clientregister/deleteuser/${ClientId}`);
export const checkEmailExists = (email) =>api.get(`/clientregister/existuser/${email}`, {headers: {"Content-Type": "application/json",},});
