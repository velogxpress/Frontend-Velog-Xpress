import api from "./api";

export const createStorageDetails = (storage) =>api.post("/storagedetails/create", storage);
export const listStorageDetails = (order) =>api.get(`/storagedetails/${order}`);
export const getStorageDetails = (order,storageId) => api.get(`/storagedetails/searching/${order}?search=${storageId}`);
export const findStorageDetails = (storageId) => api.get(`/storagedetails/findstoragedetails/${storageId}`);


