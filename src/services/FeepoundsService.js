import api from "./api";
import Lien from "../route/BASE_URL";


export const createFeepound = (Feepound) =>
  api.post(`/feepounds`, Feepound);

export const listFeepounds = (page) =>
  api.get(`/feepounds?page=${page}&size=7`);

export const getlistFeepounds = (page) =>
  api.get(`/feepounds?page=${page}&size=1000`);

export const getFeepoundByAmount = (FeepoundId, page) =>
  api.get(`/feepounds/search?amount=${FeepoundId}&page=${page}&size=7`);

export const getFeepoundById = (FeepoundId) =>
  api.get(`/feepounds/${FeepoundId}`);

export const updateFeepound = (FeepoundId, Feepound) =>
  api.put(`/feepounds/${FeepoundId}`, Feepound);
export const deleteFeepound = (FeepoundId) =>
  api.delete(`/feepounds/${FeepoundId}`);
