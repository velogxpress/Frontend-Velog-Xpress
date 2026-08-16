import api from "./api";

export const createFactureDetails = (OrderDetails) => api.post("/facturedetails", OrderDetails);
export const createQuickFactureDetails = (OrderDetails) =>api.post("/facturedetails/quickfacture", OrderDetails);
export const listFactureDetails = () => api.get("/facturedetails");
export const getFactureDetails = (OrderDetailsId,page) =>api.get(`/facturedetails/details/${OrderDetailsId}?page=${page}&size=500&sort=id,DESC`);
export const deleteFactureDetails = (OrderDetailsId) =>api.delete("/facturedetails/" + OrderDetailsId);
