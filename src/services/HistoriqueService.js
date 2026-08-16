import axios from "axios";
import REST_API_BASE_URL from "../route_url/BASE_URL"


const URL=REST_API_BASE_URL+'/historique'
const URL1=REST_API_BASE_URL+'/historiqueSearch'

export const createHistorique=(Historique)=>axios.post(URL,Historique);
export const listHistoriques=()=>axios.get(URL);
export const getHistorique=(HistoriqueId)=>axios.get(URL+'/'+HistoriqueId);
export const getAllHistorique=(HistoriqueId)=>axios.get(URL1+'/'+HistoriqueId);
export const updateHistorique=(HistoriqueId,Historique)=>axios.put(URL+'/'+HistoriqueId,Historique);
export const deleteHistorique=(HistoriqueId)=>axios.delete(URL+'/'+HistoriqueId);