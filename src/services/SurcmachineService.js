import axios from "axios";
import REST_API_BASE_URL from "../route_url/BASE_URL"

// const REST_API_BASE_URL='http://ec2-user@ec2-3-82-175-137.compute-1.amazonaws.com:8081/api/surcmachine';
// const REST_API_BASE_URL1='http://ec2-user@ec2-3-82-175-137.compute-1.amazonaws.com:8081/api/surcmachinesearch';

const URL=REST_API_BASE_URL+'/surcmachine'
const URL1=REST_API_BASE_URL+'/surcmachinesearch'

export const createSurcmachine=(Surcmachine)=>axios.post(URL,Surcmachine);
export const listSurcmachine=()=>axios.get(URL);
export const getSurcmachine=(SurcmachineId)=>axios.get(URL+'/'+SurcmachineId);
export const searchSurcmachine=(SurcmachineId)=>axios.get(URL1+'/'+SurcmachineId);
export const updateSurcmachine=(SurcmachineId,Surcmachine)=>axios.put(URL+'/'+SurcmachineId,Surcmachine);
export const deleteSurcmachine=(SurcmachineId)=>axios.delete(URL+'/'+SurcmachineId);