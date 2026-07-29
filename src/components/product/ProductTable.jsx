import { useMemo, useState,useEffect } from "react";

import {
  Box,
  Grid,
  MenuItem,
  TextField,
  Button,
  Chip,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchProductBySku,
  changeProductStatus,
  fetchProducts,
} from "../../redux/slices/productSlice";

const ProductTable = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const { allproducts, loading } = useSelector(
    (state) => state.product
  );

  const { user } = useSelector(
    (state) => state.auth
  );

  const [search, setSearch] = useState("");

  const [division, setDivision] =
    useState("All");

  const [status, setStatus] =
    useState("All");

  // ACTIONS
  const handleEdit = (sku) => {
    dispatch(fetchProductBySku(sku));
  };

  const handleStatus = async (
    sku,
    currentStatus
  ) => {
    const status =
      currentStatus === "Active"
        ? "Inactive"
        : "Active";

    const res = await dispatch(
      changeProductStatus({
        sku,
        status,
        updatedBy: user?.user?.name,
      })
    );

    if (res.payload?.success) {
      dispatch(fetchProducts());
    }
  };

  // FILTERED DATA
  const filteredRows = useMemo(() => {
    const Product = Array.isArray(allproducts) && allproducts.length > 0 ? allproducts : [];
    console.log("all products:",Product)
    return  Product.filter((item) => {
      const searchMatch =
        search === "" ||
        [
          item.sku,
          item.productName,
          item.color,
          item.size,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());

      const divisionMatch =
        division === "All" ||
        item.division === division;

      const statusMatch =
        status === "All" ||
        item.status === status;

      return (
        searchMatch &&
        divisionMatch &&
        statusMatch 
      );
    });
  }, [
    allproducts,
    search,
    division,
    status,
  ]);

  // DATAGRID COLUMNS
  const columns = useMemo(
    () => [
      {
        field: "sku",
        headerName: "SKU Code",
        width: 120,
      },

      {
        field: "productName",
        headerName: "Product Name",
        flex: 1,
        minWidth: 220,
      },

      {
        field: "division",
        headerName: "Division",
        width: 120,
      },

      {
        field: "unit",
        headerName: "Unit",
        width: 100,
      },
      {
        field: "color",
        headerName: "Color",
        width: 120,
      },

      {
        field: "size",
        headerName: "Size",
        width: 100,
      },

      {
        field: "status",
        headerName: "Status",
        width: 120,

        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value}
            color={
              params.value === "Active"
                ? "success"
                : "error"
            }
          />
        ),
      },

      {
        field: "createdBy",
        headerName: "Created By",
        width: 150,
      },

      {
        field: "createdAt",
        headerName: "Created At",
        width: 180,

        valueFormatter: (value) =>
          value
            ? new Date(value).toLocaleString(
                "en-IN"
              )
            : "",
      },

      {
        field: "updatedBy",
        headerName: "Updated By",
        width: 150,
      },

      {
        field: "updatedAt",
        headerName: "Updated At",
        width: 180,

        valueFormatter: (value) =>
          value
            ? new Date(value).toLocaleString(
                "en-IN"
              )
            : "",
      },

      {
        field: "actions",
        headerName: "Actions",
        width: 220,
        sortable: false,
        filterable: false,

        renderCell: (params) => (
          <>
            <Button
              size="small"
              variant="outlined"
              sx={{ mr: 1 }}
              onClick={() =>
                handleEdit(params.row.sku)
              }
            >
              Edit
            </Button>

            <Button
              size="small"
              variant="contained"
              color={
                params.row.status === "Active"
                  ? "error"
                  : "success"
              }
              onClick={() =>
                handleStatus(
                  params.row.sku,
                  params.row.status
                )
              }
            >
              {params.row.status ===
              "Active"
                ? "Deactivate"
                : "Activate"}
            </Button>
          </>
        ),
      },
    ],
    []
  );

  return (
    <Box>

          {/* FILTERS */}

      <Grid
        container
        spacing={2}
        mb={3}
      >
        <Grid size={{ xs: 12, md: 5 }}>
          <TextField
            fullWidth
            label="Search Product"
            placeholder="SKU, Product, Color..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 2.3 }}>
          <TextField
            select
            fullWidth
            label="Division"
            value={division}
            onChange={(e) =>
              setDivision(e.target.value)
            }
          >
            <MenuItem value="All">
              All
            </MenuItem>

            <MenuItem value="Woven">
              Woven
            </MenuItem>

            <MenuItem value="Crochet">
              Crochet
            </MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 2.3 }}>
          <TextField
            select
            fullWidth
            label="Status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <MenuItem value="All">
              All
            </MenuItem>

            <MenuItem value="Active">
              Active
            </MenuItem>

            <MenuItem value="Inactive">
              Inactive
            </MenuItem>
          </TextField>
        </Grid>

      
      </Grid>

      {/* ===========================
          DATA GRID
      ============================ */}

      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 260px)",
        }}
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.sku}
          disableRowSelectionOnClick
          density="compact"
          pageSizeOptions={[
            10,
            20,
            50,
            100,
          ]}
          columnHeaderHeight={48}
          rowHeight={42}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          sx={{
            border: 0,

            "& .MuiDataGrid-columnHeaderTitle":
              {
                fontWeight: 700,
              },

            "& .MuiDataGrid-cell": {
              borderBottom:
                "1px solid #eee",
              fontSize: 13,
            },

            "& .MuiDataGrid-row:nth-of-type(even)":
              {
                backgroundColor:
                  "#fafafa",
              },

            "& .MuiDataGrid-row:hover": {
              backgroundColor:
                "#e3f2fd",
            },

            "& .MuiDataGrid-footerContainer":
              {
                borderTop:
                  "1px solid #ddd",
              },
          }}
        />
      </Box>
    </Box>
  );
};

export default ProductTable;