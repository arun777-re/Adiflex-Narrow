  import api from './api';
  
  const url = `${import.meta.env.VITE_API_URL}/auth`;



export const loginUser = async (payload) => {

  const response = await api.post(`${url}/login`,payload, {
    timeout:30000
  });


  return response.data;
};

export const createUser = async(payload)=>{
const response  = await api.post(`${url}/create`,payload,{
  headers:{
    "Content-Type":"application/json"
  }
});
return response.data;
}
export const deleteUser = async()=>{
const response  = await api.delete(`${url}/delete`);
return response.data;
}
export const updateUser = async()=>{
const response  = await api.patch(`${url}/update`);
return response.data;
}
export const getAllUsers = async()=>{
const response  = await api.get(`${url}/all-users`);
return response.data;
}