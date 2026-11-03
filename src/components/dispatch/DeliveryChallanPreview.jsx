
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

const safe = (value) =>
  String(value ?? "-")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const money = (value) => `₹${formatNumber(value)}`;

const DeliveryChallanPreview = ({ challan, onClose }) => {
  const [printing, setPrinting] = useState(false);
  const [printError, setPrintError] = useState("");

  if (!challan) return null;

  const challanNo = challan.challanNo || "-";

  const challanDate = challan.challanDate
    ? new Date(challan.challanDate).toLocaleDateString("en-IN")
    : "-";

  // Multi-item response from backend
  const items = Array.isArray(challan.items) ? challan.items : [];

  const totalQtyMeter = Number(challan.totalQtyMeter || 0);
  const totalRolls = Number(challan.totalRolls || 0);
  const totalAmount = Number(challan.totalAmount || 0);
  const gstRate = Number(challan.gstRate || 0);
  const taxOfGst = Number(challan.taxOfGst || 0);
  const amountIncludingGst = Number(
    challan.amountIncludingGst ?? totalAmount + taxOfGst
  );

  const printChallan = () => {
    setPrintError("");

    const printWindow = window.open("", "_blank", "width=1000,height=750");

    if (!printWindow) {
      setPrintError(
        "Print window was blocked. Please allow pop-ups for this app."
      );
      return;
    }

    setPrinting(true);

    const itemRows = items
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${safe(item.salesOrderNo)}</td>
            <td>${safe(item.skuCode)}</td>
            <td>${safe(item.productName)}</td>
            <td class="right">${formatNumber(item.dispatchedQty)}</td>
            <td class="right">${formatNumber(item.rollQty)}</td>
            <td class="right">${money(item.ratePerMeter)}</td>
            <td class="right">${money(item.amount)}</td>
          </tr>
        `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Delivery Challan ${safe(challanNo)}</title>
        <style>
          @page { size: A4 landscape; margin: 12mm; }

          * { box-sizing: border-box; }

          body {
            font-family: Arial, sans-serif;
            color: #111;
            font-size: 11px;
          }

          .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #222;
            padding-bottom: 12px;
            margin-bottom: 16px;
          }

          h1 { font-size: 22px; margin: 0 0 6px; }
          h2 { font-size: 14px; margin: 0 0 8px; }

          .muted { color: #555; }

          .details {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
            margin-bottom: 18px;
          }

          .detail {
            border: 1px solid #ddd;
            padding: 9px;
            min-height: 48px;
          }

          .label {
            color: #555;
            font-size: 9px;
            text-transform: uppercase;
            margin-bottom: 5px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th, td {
            border: 1px solid #aaa;
            padding: 8px 6px;
            text-align: left;
          }

          th {
            background: #eee;
          }

          .right { text-align: right; }

          .totals {
            width: 330px;
            margin: 15px 0 0 auto;
          }

          .totals td {
            padding: 7px;
          }

          .grand-total {
            font-size: 14px;
            font-weight: bold;
          }

          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 75px;
          }

          .signatures div {
            width: 35%;
            border-top: 1px solid #333;
            padding-top: 8px;
            text-align: center;
          }

          .footer {
            margin-top: 22px;
            font-size: 9px;
            color: #555;
          }

          tr { page-break-inside: avoid; }
        </style>
      </head>

      <body>
        <div class="header">
          <div>
            <h1>DELIVERY CHALLAN</h1>
            <div class="muted">Adiflex ERP</div>
          </div>

          <div>
            <h2>Challan No: ${safe(challanNo)}</h2>
            <div>Date: ${safe(challanDate)}</div>
            <div>Status: ISSUED</div>
          </div>
        </div>

        <div class="details">
          <div class="detail">
            <div class="label">Customer</div>
            <strong>${safe(challan.customerName || challan.customer)}</strong>
          </div>

          <div class="detail">
            <div class="label">GST Number</div>
            ${safe(challan.gstNo)}
          </div>

          <div class="detail">
            <div class="label">Vehicle Number</div>
            ${safe(challan.vehicleNo)}
          </div>

          <div class="detail">
            <div class="label">Billing Location</div>
            ${safe(challan.billingLocation)}
          </div>

          <div class="detail">
            <div class="label">Shipping Location</div>
            ${safe(challan.shippingLocation)}
          </div>

          <div class="detail">
            <div class="label">Route</div>
            ${safe(challan.route)}
          </div>

          <div class="detail">
            <div class="label">Driver Name</div>
            ${safe(challan.driverName)}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>SO No.</th>
              <th>SKU Code</th>
              <th>Product Description</th>
              <th class="right">Qty (m)</th>
              <th class="right">Rolls</th>
              <th class="right">Rate/m</th>
              <th class="right">Amount</th>
            </tr>
          </thead>

          <tbody>
            ${itemRows}
          </tbody>
        </table>

        <table class="totals">
          <tr>
            <td>Total Quantity</td>
            <td class="right">${formatNumber(totalQtyMeter)} m</td>
          </tr>

          <tr>
            <td>Total Rolls</td>
            <td class="right">${formatNumber(totalRolls)}</td>
          </tr>

          <tr>
            <td>Total Amount</td>
            <td class="right">${money(totalAmount)}</td>
          </tr>

          <tr>
            <td>GST (${formatNumber(gstRate)}%)</td>
            <td class="right">${money(taxOfGst)}</td>
          </tr>

          <tr class="grand-total">
            <td>Grand Total</td>
            <td class="right">${money(amountIncludingGst)}</td>
          </tr>
        </table>

        <div class="signatures">
          <div>Received By</div>
          <div>Authorized Signatory</div>
        </div>

        <div class="footer">
          Delivery document generated by Adiflex ERP.
        </div>

        <script>
          window.onload = function() {
            window.focus();
            window.print();
          };

          window.onafterprint = function() {
            window.close();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    setPrinting(false);
  };

  return (
    <Dialog open fullWidth maxWidth="lg" onClose={onClose}>
      <DialogTitle>
        Delivery Challan Created
      </DialogTitle>

      <DialogContent>
        {printError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {printError}
          </Alert>
        )}

        <Box sx={{ p: { xs: 1, sm: 3 }, border: "1px solid #ddd" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            gap={2}
            flexWrap="wrap"
          >
            <Box>
              <Typography variant="h5" fontWeight={700}>
                DELIVERY CHALLAN
              </Typography>
              <Typography color="text.secondary">
                Adiflex ERP
              </Typography>
            </Box>

            <Box>
              <Typography fontWeight={700}>
                Challan No: {challanNo}
              </Typography>
              <Typography>Date: {challanDate}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {[
              ["Customer", challan.customerName || challan.customer],
              ["GST Number", challan.gstNo],
              ["Vehicle Number", challan.vehicleNo],
              ["Driver", challan.driverName],
              ["Route", challan.route],
              ["Billing Location", challan.billingLocation],
              ["Shipping Location", challan.shippingLocation],
            ].map(([label, value]) => (
              <Grid item xs={12} sm={6} md={4} key={label}>
                <Typography variant="caption" color="text.secondary">
                  {label}
                </Typography>
                <Typography fontWeight={600}>
                  {value || "-"}
                </Typography>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Dispatch Items ({items.length})
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  {[
                    "Sr.",
                    "SO No.",
                    "SKU",
                    "Product",
                    "Qty (m)",
                    "Rolls",
                    "Rate/m",
                    "Amount",
                  ].map((heading) => (
                    <TableCell key={heading}>
                      <Typography fontWeight={700} variant="caption">
                        {heading}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.reservationId || index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.salesOrderNo || "-"}</TableCell>
                    <TableCell>{item.skuCode || "-"}</TableCell>
                    <TableCell>{item.productName || "-"}</TableCell>
                    <TableCell align="right">
                      {formatNumber(item.dispatchedQty)}
                    </TableCell>
                    <TableCell align="right">
                      {formatNumber(item.rollQty)}
                    </TableCell>
                    <TableCell align="right">
                      {money(item.ratePerMeter)}
                    </TableCell>
                    <TableCell align="right">
                      {money(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}

                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No dispatch items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Box sx={{ width: { xs: "100%", sm: 320 } }}>
              {[
                ["Total Quantity", `${formatNumber(totalQtyMeter)} m`],
                ["Total Rolls", formatNumber(totalRolls)],
                ["Total Amount", money(totalAmount)],
                [`GST (${formatNumber(gstRate)}%)`, money(taxOfGst)],
              ].map(([label, value]) => (
                <Box
                  key={label}
                  display="flex"
                  justifyContent="space-between"
                  sx={{ py: 0.5 }}
                >
                  <Typography color="text.secondary">{label}</Typography>
                  <Typography fontWeight={600}>{value}</Typography>
                </Box>
              ))}

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight={700}>Grand Total</Typography>
                <Typography variant="h6" fontWeight={700}>
                  {money(amountIncludingGst)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Close</Button>

        <Button
          variant="contained"
          startIcon={
            printing ? <CircularProgress size={16} /> : <PrintIcon />
          }
          onClick={printChallan}
          disabled={printing}
        >
          Print Challan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeliveryChallanPreview;
