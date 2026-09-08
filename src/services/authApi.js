  import api from './api';
  
  const url = `${import.meta.env.VITE_API_URL}/auth`;



export const loginUser = async (payload) => {

  const response = await fetch(`${url}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return data;
};

export const getAllUsers = async()=>{
const response  = await api.get(`${url}/all-users`);
return response.data;
}