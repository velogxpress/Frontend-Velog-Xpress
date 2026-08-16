import api from "./api";

export const createSpecialfee = (Specialfee) =>
  api.post(`/specialfees`, Specialfee);
export const listSpecialfees = (page) =>
  api.get(`/specialfees?page=${page}&size=7`);
  export const getlistSpecialfees = (page) =>
    api.get(`/specialfees?page=${page}&size=1000`);
export const getSpecialfeeByAmount = (Specialfee, page) =>
  api.get(`/specialfees/by-amount?amount=${Specialfee}&page=${page}&size=7`);
export const getSpecialfeeById = (Specialfee) =>
  api.get(`/specialfees/${Specialfee}`);

export const updateSpecialfee = (SpecialfeeId, Specialfee) =>
  api.put(`/specialfees/${SpecialfeeId}`, Specialfee);
    
export const deleteSpecialfee = (SpecialfeeId) =>
  api.delete(`/specialfees/${SpecialfeeId}`);
