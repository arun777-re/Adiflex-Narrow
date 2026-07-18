import { useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  Box,
} from "@mui/material";

import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";

import {
  startProduction,
  completeProduction,
  fetchProductionByProcess,
} from "../../redux/slices/productionSlice";


const UpdateProductionDialog = ({
  open,
  onClose,
  order,
  process,
  action,
}) => {

  const dispatch = useDispatch();

// production state

  const {
    starting = false,
    completing = false,
  } = useSelector(
    (state) => state.production
  );


  const { user } =
    useSelector(
      (state) => state.auth
    );


  const {
    register,
    handleSubmit,
    reset,
  } = useForm();


// loading state
  const loading =
    starting ||
    completing;


// selection of first order based on job work yes or no
  const isFirstProcess =
    process === "jobWork" ||
    process === "warping";

// load orders

  useEffect(() => {

    if (!order) {

      return;

    }


    reset({

      soNo:
        order.soNo || "",

      product:
        order.product || "",

      productionQty:
        isFirstProcess
          ? order.productionQty || ""
          : "",

    });

  }, [

    order,

    reset,

    isFirstProcess,

  ]);

// Submit function

  const onSubmit = async (
    data
  ) => {


    const updatedBy =
      user?.name ||
      user?.user?.name ||
      "";

// start process

    if (
      action === "start"
    ) {


      const result =
        await dispatch(

          startProduction({

            soNo:
              data.soNo,

            product:
              data.product,

            process,

            updatedBy,

          })

        );


      if (

        startProduction.fulfilled
          .match(result)

      ) {

        await dispatch(

          fetchProductionByProcess(
            process
          )

        );


        onClose();

      }


      return;

    }

// complete first process
    if (
      action === "complete"
    ) {


      const payload = {

        soNo:
          data.soNo,

        product:
          data.product,

        process,

        updatedBy,

      };


      // ==================================
      // QTY ONLY FIRST PROCESS
      // ==================================

      if (
        isFirstProcess
      ) {

        payload.productionQty =
          Number(
            data.productionQty
          );

      }


      const result =
        await dispatch(

          completeProduction(

            payload

          )

        );


      if (

        completeProduction.fulfilled
          .match(result)

      ) {

        await dispatch(

          fetchProductionByProcess(
            process
          )

        );


        onClose();

      }

    }

  };
// Dialogue title

  const title =
    action === "start"

      ? `Start ${process} Process`

      : `Complete ${process} Process`;


  return (

    <Dialog

      open={open}

      onClose={
        loading
          ? undefined
          : onClose
      }

      fullWidth

      maxWidth="sm"

    >


      <DialogTitle>

        {title}

      </DialogTitle>


      <form

        onSubmit={
          handleSubmit(
            onSubmit
          )
        }

      >


        <DialogContent>


          <Grid

            container

            spacing={2}

          >
{/* SO No */}

            <Grid size={12}>

              <TextField

                fullWidth

                label="SO No"

                InputProps={{

                  readOnly: true,

                }}

                {...register(
                  "soNo"
                )}

              />

            </Grid>

{/* products */}
            <Grid size={12}>

              <TextField

                fullWidth

                label="Product"

                InputProps={{

                  readOnly: true,

                }}

                {...register(
                  "product"
                )}

              />

            </Grid>
{/* start process */}

            {action === "start" && (

              <Grid size={12}>

                <Box

                  sx={{

                    p: 2,

                    bgcolor:
                      "info.lighter",

                    borderRadius: 2,

                  }}

                >

                  <Typography

                    variant="body2"

                  >

                    Click below to start the{" "}

                    <strong>

                      {process}

                    </strong>{" "}

                    process.

                  </Typography>


                  <Typography

                    variant="caption"

                    color="text.secondary"

                  >

                    The process start time will be

                    recorded automatically.

                  </Typography>

                </Box>

              </Grid>

            )}

{/* production qty */}

            {action === "complete" &&
              isFirstProcess && (

                <Grid size={12}>

                  <TextField

                    fullWidth

                    type="number"

                    label="Production Qty"

                    inputProps={{

                      min: 1,

                    }}

                    {...register(

                      "productionQty",

                      {

                        required:

                          "Production Qty is required",

                        min: {

                          value: 1,

                          message:

                            "Quantity must be greater than 0",

                        },

                      }

                    )}

                  />
                  <Typography

                    variant="caption"

                    color="text.secondary"

                  >

                    Production quantity is entered

                    only in the first process.

                  </Typography>

                </Grid>

              )}
{/* Next process information */}
            {action === "complete" &&

              !isFirstProcess && (

                <Grid size={12}>

                  <Box

                    sx={{

                      p: 2,

                      bgcolor:
                        "action.hover",

                      borderRadius: 2,

                    }}

                  >

                    <Typography

                      variant="body2"

                      color="text.secondary"

                    >

                      Production Qty:{" "}

                      <strong>

                        {Number(

                          order?.productionQty ||
                          0

                        ).toLocaleString()}

                      </strong>

                    </Typography>


                    <Typography

                      variant="caption"

                      color="text.secondary"

                    >

                      This process does not require

                      a production quantity.

                    </Typography>

                  </Box>

                </Grid>

              )}

          </Grid>

        </DialogContent>


        <DialogActions>


          <Button

            onClick={onClose}

            disabled={loading}

          >

            Cancel

          </Button>


          <Button

            type="submit"

            variant="contained"

            disabled={loading}

          >

            {loading

              ? action === "start"

                ? "Starting..."

                : "Completing..."

              : action === "start"

                ? "Start Process"

                : "Complete Process"}

          </Button>


        </DialogActions>


      </form>


    </Dialog>

  );

};


export default UpdateProductionDialog;