import axios from "axios";
import REST_API_BASE_URL from "../route_url/BASE_URL"

// const REST_API_BASE_URL='http://ec2-user@ec2-3-82-175-137.compute-1.amazonaws.com:8081/api/printlabel';

const URL=REST_API_BASE_URL+'/printlabel'

export const getLabel=(LabelId)=>axios.get(URL+'/'+LabelId);