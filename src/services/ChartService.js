import axios from "axios";
import REST_API_BASE_URL from "../route_url/BASE_URL"


const URL=REST_API_BASE_URL+'/shippingcity'
const URL1=REST_API_BASE_URL+'/chartcity'

export const listVille=()=>axios.get(URL1);
export const listCommande=()=>axios.get(URL);

