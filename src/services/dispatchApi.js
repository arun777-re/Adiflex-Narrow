import api from "./api"

export const getAllcompletedDispatch = async(params={})=>{
const response = await api.get('/dispatch/completed',{
    params,
});
return response.data;
}