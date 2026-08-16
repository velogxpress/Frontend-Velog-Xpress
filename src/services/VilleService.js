import api from "./api";

export const createVille = (Ville) =>
  api.post("/ville", Ville, {
    headers: {
      "Content-Type": "application/json",
 
    },
  });
export const listVilles = (page) =>
  api.get(`/ville?page=${page}&size=9`, {
    headers: {
      "Content-Type": "application/json",
      
    },
  });
export const getlistVilles = (page) =>
  api.get(`/ville?page=${page}&size=1000`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
export const getVille = (VilleId) =>
  api.get(`/ville/${VilleId}`, {
    headers: {
      "Content-Type": "application/json",
      
    },
  });
export const updateVille = (VilleId, Ville) =>
  api.put(`/ville/${VilleId}`, Ville, {
    headers: {
      "Content-Type": "application/json",
      
    },
  });
export const deleteVille = (VilleId) =>
  api.delete(`/ville/${VilleId}`, {
    headers: {
      "Content-Type": "application/json",
      
    },
  });
export const getVilleRegion = (VilleId,page) =>
  api.get(`/ville/region/${VilleId}?page=${page}&size=100`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
export const listCities = (page) =>
  api.get(`/ville?page=${page}&size=1000`, {
    headers: {
      "Content-Type": "application/json",
      
    },
  });
