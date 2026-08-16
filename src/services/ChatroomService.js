import axios from "axios";
import REST_API_BASE_URL from "../route_url/BASE_URL"

const URL=REST_API_BASE_URL+'/chatroom'


export const createChatroom=(Chatroom)=>axios.post(URL,Chatroom);
export const listChatrooms=()=>axios.get(URL);
export const getChatroom=(ChatroomId)=>axios.get(URL+'/'+ChatroomId);
export const updateChatroom=(ChatroomId)=>axios.put(URL+'/'+ChatroomId);
export const deleteChatroom=(ChatroomId)=>axios.delete(URL+'/'+ChatroomId);
