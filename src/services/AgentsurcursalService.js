import api from "./api";
export const createAgentSurcursal= (surcursal) => api.post("/agentsurcursal", surcursal);
export const listAgentSurcursal=(page)=>api.get("/agentsurcursal?page="+page+"&size=9&sort=id,desc");
export const getAgentSurcursal=(surcursal)=>api.get("/agentsurcursal/"+surcursal);
export const searchAgentSurcursal=(surcursal,page)=>api.get("/agentsurcursal/search/"+surcursal+"?page="+page+"&size=9&sort=id,desc");
export const deleteAgentSurcursal = (surcursal) => api.delete("/agentsurcursal/" + surcursal);
export const updateAgentSurcursal = (usercode,surcursal) => api.put("/agentsurcursal/" + usercode,surcursal);
