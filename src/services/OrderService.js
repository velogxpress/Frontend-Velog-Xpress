import api from './api';

export const createOrder = () => api.post("/order");
export const getlistOrders=(page)=>api.get(`/order/combo?page=${page}&size=50&sort=id,desc`);
export const getDashboardOrders=()=>api.get(`/order/combo?page=0&size=1000&sort=id,desc`);
export const listOrders = (page) =>api.get(`/order?page=${page}&size=9&sort=id,desc`);
export const getOrder = (OrderId) => api.get("/order/" + OrderId);

export const updateOrder = (OrderId, Order) => api.put("/order/" + OrderId, Order);

export const deleteOrder=(OrderId)=>api.delete("/order/"+OrderId);
export const searchOrder=(OrderId,page)=>api.get(`/order/search/${OrderId}?page=${page}&size=9`);
export const countOrders = () => api.get(`/order/countcolis`);
export const countOrdersNow = () => api.get(`/order/countcolisnow`);

export const printRapportGeneral = (upc) =>
  api.get("/order/rapportdownload/" + upc, {
    responseType: "blob", // 🔥 clé de la solution
    headers: {
      Accept: "application/pdf",
    },
  });
