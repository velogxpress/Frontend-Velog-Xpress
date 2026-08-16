import axios from "axios";
import REST_API_BASE_URL from "../route_url/BASE_URL"

// const REST_API_BASE_URL='http://ec2-user@ec2-3-82-175-137.compute-1.amazonaws.com:8081/api/facture';
// const REST_API_BASE_URL2='http://ec2-user@ec2-3-82-175-137.compute-1.amazonaws.com:8081/api/searchfacture';

const URL=REST_API_BASE_URL+'/colisdelivered'
const URL1=REST_API_BASE_URL+'/colisshipped'
const URL2=REST_API_BASE_URL+'/colisready'


export const getDelivery=(FactureId)=>axios.get(URL+'/'+FactureId);
export const getExpedier=(FactureId)=>axios.get(URL1+'/'+FactureId);
export const getDispo=(FactureId)=>axios.get(URL2+'/'+FactureId);