import api from "./api";
import Lien from "../route/BASE_URL";



export const createTaux = (taux) =>
  api.post("/taux", taux);

export const listTaux = (page) =>
  api.get(`/taux?page=${page}&size=7`);

export const getTaux = (taux) =>
  api.get(`/taux/gettaux/${taux}`);

  export const searchTaux = (taux, page) =>
    api.get(`/taux/devise/${taux}?page=${page}&size=7`);

export const updateTaux = (tauxId, taux) =>
  api.put(`/taux/${tauxId}`, taux);

export const deleteTaux = (tauxId) =>
  api.delete(`/taux/${tauxId}`);
