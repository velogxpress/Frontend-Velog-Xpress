import api from "./api";

export const createStore= (store) => api.post("/store", store);
export const listStore = () => api.get(`/store`);
export const getStore = (storeId) => api.get(`/store/${storeId}`);
export const updateStore = (storeId, store) => api.put(`/store/${storeId}`, store);
