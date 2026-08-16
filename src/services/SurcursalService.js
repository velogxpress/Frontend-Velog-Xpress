import api from "./api";


export const createSurcursal=(Surcursal)=>api.post("/surcursal",Surcursal);
export const getlistSurcursals = (page) =>api.get(`/surcursal?page=${page}&size=7`);
export const listSurcursals=(page)=>api.get(`/surcursal?page=${page}&size=100`,);
export const getSurcursal=(SurcursalId,page)=>api.get(`/surcursal/surcursalsearch/${SurcursalId}?page=${page}&size=7`);
export const updateSurcursal=(SurcursalId,Surcursal)=>api.put(`/surcursal/${SurcursalId}`,Surcursal);
export const deleteSurcursal=(SurcursalId)=>api.delete(`/surcursal/${SurcursalId}`);