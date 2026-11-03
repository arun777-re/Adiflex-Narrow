import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Select,
  MenuItem,
} from "@mui/material";

const UpdateInventoryDialog = ({
  editOpen,
  handleCloseEdit,
  handleUpdateStock,
  selectedItem,
  setStockUnit,
  newFGQty,
  stockUnit,
  setNewFGQty,
  stockUnitRef,
  loading = false,
}) => {
  const currentQty = Number(selectedItem?.availableQty ?? 0);
  const meterPerRoll = Number(selectedItem?.meterPerRoll ?? 0);
  const enteredQty = Number(newFGQty);

  const convertedQty =
    stockUnit === "ROLL" ? enteredQty * meterPerRoll : enteredQty;

  const isInvalid =
    newFGQty === "" ||
    !Number.isFinite(Number(enteredQty)) ||
    Number(newFGQty) < 0 ||
    (stockUnit === "ROLL" && meterPerRoll <= 0);
  const difference = convertedQty - currentQty;

  return (
    <Dialog
      open={editOpen}
      onClose={loading ? undefined : handleCloseEdit}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Edit FG Stock</DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={1}>
          Update finished goods inventory quantity.
        </Typography>

        {/* SKU CODE */}
        <TextField
          fullWidth
          label="SKU Code"
          value={selectedItem?.sku ?? ""}
          disabled
          margin="normal"
        />

        {/* PRODUCT NAME */}
        <TextField
          fullWidth
          label="Product Name"
          value={selectedItem?.productName ?? ""}
          disabled
          margin="normal"
        />

        {/* CURRENT STOCK */}
        <TextField
          fullWidth
          label="Current FG Qty"
          value={currentQty}
          disabled
          margin="normal"
          InputProps={{
            endAdornment: <InputAdornment position="end">M</InputAdornment>,
          }}
        />

        {/* NEW STOCK */}
        <TextField
          fullWidth
          label="New FG Qty"
          type="number"
          value={newFGQty}
          onChange={(e) => setNewFGQty(e.target.value)}
          margin="normal"
          autoFocus
          disabled={loading}
          inputProps={{
            min: 0,
            step: "any",
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">M</InputAdornment>,
          }}
        />
        {/* user can select unit of stock in which he/she entered */}
        <TextField
          select
          fullWidth
          label="Stock Entry Unit"
          value={stockUnit}
          onChange={(e) => {
            const value = e.target.value;
            setStockUnit(value);
            stockUnitRef.current = value;
          }}
          margin="normal"
          disabled={loading}
        >
          <MenuItem value="METER">Meter</MenuItem>
          <MenuItem value="ROLL">Roll</MenuItem>
        </TextField>

        {/* STOCK DIFFERENCE */}
        {newFGQty !== "" && Number.isFinite(Number(newFGQty)) && (
          <Typography
            variant="body2"
            sx={{ mt: 1 }}
            color={
              Number(newFGQty) >= currentQty ? "success.main" : "error.main"
            }
          >
            Difference: {Number(newFGQty) - currentQty > 0 ? "+" : ""}
            {difference} M
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCloseEdit} disabled={loading}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleUpdateStock}
          disabled={isInvalid || loading}
        >
          {loading ? "Updating..." : "Save Stock"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateInventoryDialog;
