
import {
  useSelector,
} from "react-redux";
import { DASHBOARD_COMPONENTS } from "../utils/dashBoardData";




const DashBoard = ()=>{

const {user} = useSelector((state)=> state.auth);

const DashboardComponent = DASHBOARD_COMPONENTS[user?.user.role]
  return DashboardComponent ? <DashboardComponent/> : null;
}

export default DashBoard;