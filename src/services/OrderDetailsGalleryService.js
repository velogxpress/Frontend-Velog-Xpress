import api from "./api";

export const getOrderDetailsPhotos = (orderDetailsId) => api.get(`/orderdetails-photos/${orderDetailsId}`);

export const addOrderDetailsPhoto = (orderDetailsId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/orderdetails-photos/${orderDetailsId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteOrderDetailsPhoto = (photoId) => api.delete(`/orderdetails-photos/${photoId}`);
