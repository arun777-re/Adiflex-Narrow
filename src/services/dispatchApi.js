import api from "./api"

export const getAllcompletedDispatch = async()=>{
const response = await api.get('/dispatch/completed');
return response.data;
}