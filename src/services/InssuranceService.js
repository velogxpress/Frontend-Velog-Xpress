import api from "./api";
import Lien from "../route/BASE_URL";

const BASE_URL = `${Lien.REST_API_BASE_URL}/insurance`;

export const createAssurance = (Assurance) =>
  api.post(`/insurance`, Assurance);
export const listAssurances = (page) =>
  api.get(`/insurance?page=${page}&size=7`);
export const getlistAssurances = (page) =>
  api.get(`/insurance?page=${page}&size=1000`);
export const getAssuranceByAmount = (AssuranceId,page) =>
  api.get(`/insurance/by-amount?amount=${AssuranceId}&page=${page}&size=7`);

export const getAssuranceById = (AssuranceId) =>
  api.get(`/insurance/${AssuranceId}`);


export const updateAssurance = (AssuranceId, Assurance) =>
  api.put(`/insurance/${AssuranceId}`, Assurance);

export const deleteAssurance = (AssuranceId) =>
  api.delete(`/insurance/${AssuranceId}`);
  
