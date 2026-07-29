import api from "./api";

export const getFGAvailableQty = async(sku)=>{
    const response = await api.get(`/fg/${sku}`);

    return response.data;
}

// consume fg stock
export const consumeFGStock = async(data)=>{
    const response = await api.patch('/fg/consume',data);
    return response.data;
}

// add fg stock
export const addFGStock = async (data) => {
  const response = await api.post(
    "/fg/add",
    data
  );

  return response.data;
};
// get all fg
export const allFGInventory = async (data) => {
  const response = await api.get(
    "/fg/all",
    data
  );

  return response.data;
};