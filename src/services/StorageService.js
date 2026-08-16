import api from "./api";

export const createStorage = (storage) =>
  api.post("/storage", storage);
export const listStorage = () => api.get(`/storage`);
export const searchStorage = (storage) => api.get(`/storage/search/${storage}`);
export const getStorage = (storageId) =>api.get(`/storage/${storageId}`);
export const updateStorage = (storageId, storage) =>api.put(`/storage/${storageId}`, storage);