import api from "./api";

export const sendEmail = (to, subject, message) => api.post(`/sendemail/send?to=${to}&subject=${subject}&body=${message}`);
export const sendEmailToAll = (subject, message) => api.post(`/sendemail/sending?subject=${subject}&body=${message}`);

