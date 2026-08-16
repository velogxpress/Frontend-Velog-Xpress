import axios from "axios";
import Lien from "../route/BASE_URL";
const BASE_URL = `${Lien.REST_API_BASE_URL}/recoveries`;

export const createRecovery=(Recovery)=>axios.post(BASE_URL,Recovery);
export const listRecovery=()=>axios.get(BASE_URL);
export const getRecovery=(RecoveryId)=>axios.get(BASE_URL+`/getotp?email=${RecoveryId}`);
export const updateRecovery = (RecoveryId) => axios.put(BASE_URL + `/updatepin/${RecoveryId}`);
export const verifyToken = (token) => axios.get(BASE_URL + `/verify-token?token=${token}`);
export const resetPassword = (token, newPassword) => axios.post(
  BASE_URL + `/reset-password?token=${encodeURIComponent(token)}`,
  { newPassword },
  { headers: { "Content-Type": "application/json" } }
);
