import api from "./api";


// get analtics for admin dashboard
export const admindashboardAPI = async()=>{
    const response = await api.get('/dashboard/admin');
    return response.data;
}
