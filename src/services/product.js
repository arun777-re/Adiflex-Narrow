import api from "./api";

// CREATE PRODUCT
export const createProduct = async (
  payload
) => {
  const { data } = await api.post(
    "/products/create",
    payload
  );

  return data;
};

// GET ALL PRODUCTS
export const getProducts = async () => {
  const { data } = await api.get(
    "/products/all"
  );

  return data;
};

// GET PRODUCT BY SKU
export const getProductBySku = async (
  sku
) => {
  const { data } = await api.get(
    `/products/${sku}`
  );

  return data;
};

// UPDATE PRODUCT
export const updateProduct = async ({
  sku,
  ...payload
}) => {
  const { data } = await api.put(
    `/products/${sku}`,
    payload
  );

  return data;
};

// UPDATE PRODUCT STATUS
export const updateProductStatus =
  async ({
    sku,
    status,
    updatedBy,
  }) => {
    const { data } = await api.patch(
      `/products/${sku}/status`,
      {
        status,
        updatedBy,
      }
    );

    return data;
  };