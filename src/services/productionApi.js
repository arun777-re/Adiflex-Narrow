import api from "./api";


// =====================================================
// GET PRODUCTION BY PROCESS + DIVISION
// =====================================================

export const getProductionByProcess = async ({
  process,
  division,
}) => {

  const { data } =
    await api.get(
      `/production/process/${process}`,
      {
        params: {
          division,
        },
      }
    );

  return data;

};


// =====================================================
// GET ALL PRODUCTION ORDERS
// =====================================================

export const getAllProduction = async (division) => {
  const response =
    await api.get(
      `/production/getAll/${division}`
    );

  return response.data;

};


// =====================================================
// START PRODUCTION PROCESS
// =====================================================

export const startProductionProcess =
  async (payload) => {

    console.log(
      "Payload for starting process:",
      payload
    );

    const { data } =
      await api.patch(

        "/production/process/start",

        payload

      );

    return data;

  };


// =====================================================
// COMPLETE PRODUCTION PROCESS
// =====================================================

export const completeProductionProcess =
  async (payload) => {

    console.log(
      "Payload for completing process:",
      payload
    );

    const { data } =
      await api.patch(

        "/production/process/complete",

        payload

      );

    return data;

  };


// =====================================================
// COMPLETE QUALITY + WASTAGE
// =====================================================

export const completeQualityWithWastage =
  async (payload) => {

    const response =
      await api.post(

        "/production/complete-quality",

        payload

      );

    return response.data;

  };