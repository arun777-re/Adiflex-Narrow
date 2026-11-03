import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllPackingProductions } from "../../redux/slices/productionSlice";
import CommonTable from "./CommonTable";


const PackingSupervisorTable = () => {
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getAllPackingProductions("all")).unwrap();
    },[dispatch]);

    const {packingSuprvsrProduction} = useSelector((state)=> state.production)

    return (
  <CommonTable
  rows={packingSuprvsrProduction}
    department="packing"
  />);
};

export default PackingSupervisorTable;
