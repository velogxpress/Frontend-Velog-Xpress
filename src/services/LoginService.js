import axios from "axios";
import api from "./api";
import Lien from "../route/BASE_URL";
const BASE_URL = `${Lien.REST_API_BASE_URL}/auth/login`;
const BASE_URL1 = `${Lien.REST_API_BASE_URL}/register`;

export const login = (credentials) => axios.post(`${BASE_URL}`, credentials);
export const getClient = (ClientId) => api.get(`/register/client?code=${ClientId}`, { headers: { "Content-Type": "application/json", }, });
export const createClient = (Client) =>axios.post(`${BASE_URL1}/create`, Client, {headers: {"Content-Type": "application/json",},});
export const checkEmailExists = (email) => axios.get(`${BASE_URL1}/existuser/${email}`, { headers: { "Content-Type": "application/json", }, });
export const countClient = () => axios.get(`${BASE_URL1}/countclient`, { headers: { "Content-Type": "application/json", }, });
export const trackmyOrderDetails = (orderDetailsId) => axios.get(`${BASE_URL1}/trackcolis?search=${orderDetailsId}`, { headers: { "Content-Type": "application/json", }, });
