import api from "./api";

export const getProductionByProcess = async (process) => {
  const { data } = await api.get(
    `/production/process/${process}`
  );

  return data;
};

export const updateProductionProcess = async (payload) => {
  console.log("payload for update process:",payload)
  const { data } = await api.patch(
    "/production/process",
    payload
  );
console.log("data comes in slices for prod:",data)
  return data;
};

export const updateWastage = async (payload) => {
  const { data } = await api.patch(
    "/production/wastage",
    payload
  );

  return data;
};