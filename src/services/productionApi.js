import api from "./api";


// get production by process

export const getProductionByProcess = async (
  process
) => {

  const { data } =
    await api.get(
      `/production/process/${process}`
    );

  return data;

};


// start production process

export const startProductionProcess = async (
  payload
) => {

  console.log(
    "Payload for starting process:",
    payload
  );

  const { data } =
    await api.patch(

      "/production/process/start",

      payload

    );

  console.log(
    "Start process response:",
    data
  );

  return data;

};


// complete production process 

export const completeProductionProcess = async (
  payload
) => {

  console.log(
    "Payload for completing process:",
    payload
  );

  const { data } =
    await api.patch(

      "/production/process/complete",

      payload

    );

  console.log(
    "Complete process response:",
    data
  );

  return data;

};


// update wastage 

export const updateWastage = async (
  payload
) => {

  const { data } =
    await api.patch(

      "/production/wastage",

      payload

    );

  return data;

};