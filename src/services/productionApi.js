import api from "./api";

export const getProductionByProcess = async (process) => {
  const { data } = await api.get(
    `/production/process/${process}`
  );

  return data;
};

export const updateProductionProcess = async (payload) => {
  const { data } = await api.patch(
    "/production/process",
    payload
  );

  return data;
};

export const updateWastage = async (payload) => {
  const { data } = await api.patch(
    "/production/wastage",
    payload
  );

  return data;
};