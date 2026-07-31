import { createSlice ,createAsyncThunk} from "@reduxjs/toolkit";
import { admindashboardAPI } from "../../services/dashBoardApi";



const initialState ={
 loading:false,
 error:null,
 dashboardData:[]
}



export const adminDashboardData = createAsyncThunk('dashboard/admindata',async()=>{
    const response = await admindashboardAPI();
    console.log("response",response)
    return response;
})



const dashBoardSlice = createSlice({
    name:"dashboard",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
.addCase(adminDashboardData.fulfilled,(state,action)=>{
    state.dashboardData= action.payload;
    state.error = null;
    state.loading = false;
})
    }
});


export default dashBoardSlice.reducer;