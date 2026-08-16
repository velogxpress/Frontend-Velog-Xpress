import axios from "axios";
import REST_API_BASE_URL from "../route_url/BASE_URL"

// const REST_API_BASE_URL='http://ec2-user@ec2-3-82-175-137.compute-1.amazonaws.com:8081/api/machine';
// const REST_API_BASE_URL1='http://ec2-user@ec2-3-82-175-137.compute-1.amazonaws.com:8081/api/searchmachine';

const URL=REST_API_BASE_URL+'/machine'
const URL1=REST_API_BASE_URL+'/searchmachine'

export const createMachine=(Machine)=>axios.post(URL,Machine);
export const listMachines=()=>axios.get(URL);
export const getMachine=(MachineId)=>axios.get(URL+'/'+MachineId);
export const searchMachine=(MachineId)=>axios.get(URL1+'/'+MachineId);
export const updateMachine=(MachineId,Machine)=>axios.put(URL+'/'+MachineId,Machine);
export const deleteMachine=(MachineId)=>axios.delete(URL+'/'+MachineId);