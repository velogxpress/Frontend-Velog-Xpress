import axios from "axios";
import REST_API_BASE_URL from "../route_url/BASE_URL";

const URL = REST_API_BASE_URL + "/tempdetails";
const URL1 = REST_API_BASE_URL + "/tempdetailsList";
const URL2 = REST_API_BASE_URL + "/deletetempdetails";
const URL3 = REST_API_BASE_URL + "/tempdetailsSingle";

export const createTempDetails = (OrderDetails) =>
  axios.post(URL, OrderDetails);
export const listTempDetails = (OrderDetailsId) =>
  axios.get(URL + "/" + OrderDetailsId);
export const getTempDetails = (OrderDetailsId) =>
  axios.get(URL1 + "/" + OrderDetailsId);
export const getTempDetailsSingle = (OrderDetailsId) =>
  axios.get(URL3 + "/" + OrderDetailsId);
export const deleteTempDetails = (OrderDetailsId) =>
  axios.delete(URL + "/" + OrderDetailsId);
export const deleteAllTempDetails = (OrderDetailsId) =>
  axios.delete(URL2 + "/" + OrderDetailsId);
export const updateTempDetails = (OrderDetailsId, OrderDetails) =>
  axios.put(URL + "/" + OrderDetailsId, OrderDetails);
