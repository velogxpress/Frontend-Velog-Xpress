import api from "./api";


export const createFacture = (Facture) => api.post("/facture", Facture);
export const listFactures=(page)=>api.get(`/facture?page=${page}&size=9&sort=id,DESC`);
export const listFacturesDashboard=()=>api.get(`/facture?page=0&size=1000&sort=id,DESC`);
export const getFacture=(FactureId)=>api.get("/facture/"+FactureId);
export const searchFacture=(FactureId,page)=>api.get(`/facture/searchfacture/${FactureId}?page=${page}&size=9&sort=id,DESC`);
export const deleteFacture = (FactureId) => api.delete("/facture/" + FactureId);
export const updateFacture = (FactureId) => api.put("/facture/" + FactureId);
export const printFacture = (factureId) => api.get("/facture/facturedownload/" + factureId, { responseType: "blob", headers: { Accept: "application/pdf", }, });
export const printFactureA4 = (factureId) =>api.get("/facture/facturedownloadA4/" + factureId, {responseType: "blob",headers: {Accept: "application/pdf",},});
export const getFactureToday = () => api.get("/facture/facturetoday");
export const getFactureTodayFromMyCity = (ID) => api.get("/facture/facturetodays/" + ID);
export const getFactureSatistique = (orderID, page) => api.get("/facture/getfacturestatistique?orderID=" + orderID + "&page=" + page + "&size=7&sort=id,DESC");
export const getFactureSatistiqueSurcursal = (orderID, surcursalID, page) => api.get("/facture/getfacturestatistique/" + orderID + "?surcursalID=" + surcursalID + "&page=" + page + "&size=7&sort=id,DESC");
export const listFactureslimite = (page) => api.get(`/facture?page=${page}&size=7&sort=id,DESC`);
export const whatsappFacture = (factureId) =>api.get("/facture/whatsappfacture/" + factureId);
