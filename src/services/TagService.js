import api from "./api";

export const getTags = (tag) => api.get(`/tag/bin/${tag}`);