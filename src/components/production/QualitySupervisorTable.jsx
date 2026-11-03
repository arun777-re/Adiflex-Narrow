
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";
import useNotification from '../../hooks/useNotification';

import { getAllQualityProductions } from "../../redux/slices/productionSlice";
import CommonTable from "./CommonTable";

const QualitySupervisorTable = () => {
  const [division, setDivision] = useState("all");

  const dispatch = useDispatch();

  useNotification({
    event:"new-notification",
    refetch:getAllQualityProductions
  })
  const { qualitySuprvsrProduction } = useSelector(
    (state) => state.production
  );

  useEffect(() => {
    dispatch(getAllQualityProductions(division)).unwrap().catch((error) => {
      console.error("Failed to fetch quality orders:", error);
    });
  }, [dispatch, division]);

  const handleDivisionChange = (event) => {
    setDivision(event.target.value);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Quality & Finishing Orders
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Orders released to the Quality department
            </Typography>
          </Box>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="quality-division-label">
              Select Division
            </InputLabel>

            <Select
              labelId="quality-division-label"
              id="quality-division"
              value={division}
              label="Select Division"
              onChange={handleDivisionChange}
            >
              <MenuItem value="all">All Divisions</MenuItem>
              <MenuItem value="woven">Woven</MenuItem>
              <MenuItem value="crochet">Crochet</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <CommonTable
        rows={qualitySuprvsrProduction || []}
        department="quality"
      />
    </Box>
  );
};

export default QualitySupervisorTable;
