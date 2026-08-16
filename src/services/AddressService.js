
import api from "./api";


export const createAddress=(Address)=>api.post("/mainaddress",Address);
export const listAddresss=()=>api.get("/mainaddress");
export const getAddress=(AddressId)=>api.get("/mainaddress/"+AddressId);
export const updateAddress=(AddressId,Address)=>api.put("/mainaddress/"+AddressId,Address);
export const deleteAddress=(AddressId)=>api.delete("/mainaddress/"+AddressId);