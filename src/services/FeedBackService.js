import axios from "axios";
import Lien from "../route/BASE_URL";

const BASE_URL = `${Lien.REST_API_BASE_URL}/feedback`;


export const createFeedBack=(FeedBack)=>axios.post(BASE_URL,FeedBack);
export const listFeedBacks=(page)=>axios.get(`${BASE_URL}?page=${page}&size=9&sort=id,DESC`,);
export const unreadFeedBack = (page) => axios.get(`${BASE_URL}/unread?page=${page}&size=10&sort=id,DESC`,);
export const countUnreadFeedBack = () => axios.get(`${BASE_URL}/count`);
export const markAsRead=(id)=>axios.put(`${BASE_URL}/${id}`);
