import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
} from "@mui/material";

import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";

import {
  updateProduction,
  fetchProductionByProcess,
} from "../../redux/slices/productionSlice";

const UpdateProductionDialog = ({
  open,
  onClose,
  order,
  process,
}) => {

  const dispatch = useDispatch();

  const { updating } = useSelector(
    (state) => state.production
  );

  const { user } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {

    if (order) {

      reset({

        soNo: order.soNo,

        product: order.product,

        productionQty: order.productionQty,

      });

    }

  }, [order, reset]);

  const onSubmit = async (data) => {

    await dispatch(

      updateProduction({

        soNo: data.soNo,

        product: data.product,

        productionQty: Number(
          data.productionQty
        ),

        process,

        updatedBy: user.name,

      })

    );

    dispatch(
      fetchProductionByProcess(process)
    );

    onClose();

  };

  return (

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >

      <DialogTitle>

        Update Production

      </DialogTitle>

      <form
        onSubmit={handleSubmit(onSubmit)}
      >

        <DialogContent>

          <Grid
            container
            spacing={2}
          >

            <Grid size={12}>

              <TextField
                fullWidth
                label="SO No"
                InputProps={{
                  readOnly: true,
                }}
                {...register("soNo")}
              />

            </Grid>

            <Grid size={12}>

              <TextField
                fullWidth
                label="Product"
                InputProps={{
                  readOnly: true,
                }}
                {...register("product")}
              />

            </Grid>

            <Grid size={12}>

              <TextField
                fullWidth
                type="number"
                label="Production Qty"

                {...register(
                  "productionQty",
                  {
                    required: true,
                    min: 1,
                  }
                )}
              />

            </Grid>

          </Grid>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={updating}
          >

            {

              updating
              ?

              "Updating..."

              :

              "Complete Process"

            }

          </Button>

        </DialogActions>

      </form>

    </Dialog>

  );

};

export default UpdateProductionDialog;