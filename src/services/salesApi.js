import api from "./api";

export const getSalesOrders = async () => {
  const { data } = await api.get("/sales-orders/get");
  return data;
};

export const createSalesOrder = async (payload) => {
  const { data } = await api.post("/sales-orders/create", {
    ...payload,
  });

  return data;
};

export const updateSalesOrder = async (payload,soNO) => {
  const { data } = await api.post(`/sales-orders/${soNO}/status`, {
    action: "updateSalesOrder",
    ...payload,
  });

  return data;
};