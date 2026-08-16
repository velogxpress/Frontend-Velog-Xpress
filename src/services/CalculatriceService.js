import axios from "axios";
import Lien from "../route/BASE_URL";

const BASE_URL = `${Lien.REST_API_BASE_URL}/calculatrice`;

export const getPrice = (CategorieId,poids) =>
  axios.get(`${BASE_URL}?idCity=${CategorieId}&pound=${poids}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

 