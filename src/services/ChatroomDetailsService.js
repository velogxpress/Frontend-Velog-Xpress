import axios from "axios";
import REST_API_BASE_URL from "../route_url/BASE_URL"

const URL=REST_API_BASE_URL+'/chatroomdetails'
const URL1=REST_API_BASE_URL+'/chatroomdetailscount'


export const createChatroomDetails=(ChatroomDetails)=>axios.post(URL,ChatroomDetails);
export const getChatroomDetails=(ChatroomDetailsId)=>axios.get(URL+'/'+ChatroomDetailsId);
export const getCountChatroom=(ChatroomDetailsId)=>axios.get(URL1+'/'+ChatroomDetailsId);
