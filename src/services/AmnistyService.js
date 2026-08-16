import api from "./api";

const cleanQueryValue = (value) => String(value ?? "").trim();

export const createAmnisty = (amnisty) => api.post('/amnisty/save-colis', amnisty);
export const listAmnisty = () =>api.get(`/amnisty`);
export const searchmyAmnisty= (tracking) => api.get(`/amnisty/searchamnisty?search=${tracking}`);
export const printAmnistyLabel = (upc) =>
  api.get("/amnisty/amnistylabeldownload/" + upc, {
    responseType: "blob", // 🔥 clé de la solution
    headers: {
      Accept: "application/pdf",
    },
  });
  export const downloadAmnistyInvoice = (name,phone,tracking) =>
  api.get(`/amnisty/amnistyinvoicedownload?name=${encodeURIComponent(cleanQueryValue(name))}&phone=${encodeURIComponent(cleanQueryValue(phone))}&tracking=${encodeURIComponent(cleanQueryValue(tracking))}`, {
    responseType: "blob", // 🔥 clé de la solution
    headers: {
      Accept: "application/pdf",
    },
  });
export const updateAmnistyStatus = (amnistyId, status) => api.put(`/amnisty/updateamnisty/${amnistyId}`,  status );
