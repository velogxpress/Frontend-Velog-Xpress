import api from "./api";


export const createCipinfee=(Cipinfee)=>api.post("/cipinfees",Cipinfee);
export const listCipinfees=(page)=>api.get("/cipinfees?page="+page+"&size=9");
export const getCipinfee=(CipinfeeId)=>api.get("/cipinfees/"+CipinfeeId);
export const searchCipinfee=(CipinfeeId,page)=>api.get(`/cipinfees/search/${CipinfeeId}?page=${page}&size=9`);
export const updateCipinfee=(CipinfeeId,Cipinfee)=>api.put("/cipinfees/"+CipinfeeId,Cipinfee);
export const deleteCipinfee = (CipinfeeId) => api.delete("/cipinfees/" + CipinfeeId);
export const getAmountFees = (cityID) =>api.get(`/cipinfees/feesfound/${cityID}`);
