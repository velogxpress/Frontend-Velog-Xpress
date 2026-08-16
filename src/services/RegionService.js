import axios from "axios";
import Lien from "../route/BASE_URL";

const BASE_URL = `${Lien.REST_API_BASE_URL}/region`;

export const listRegions = () =>
  axios.get(`${BASE_URL}`, {
    headers: {
      "Content-Type": "application/json", 
    },
  });

  export const listRegionslimite = (page) =>
  axios.get(`${BASE_URL}/limitedregion?page=${page}&size=10`, {
    headers: {
      "Content-Type": "application/json", 
    },
  });
  export const getRegionByID = (region) =>
    axios.get(`${BASE_URL}/id/${region}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });