import React from 'react'
import { useSelector } from 'react-redux'
import WovenDashBoard from './WovenDashBoard';
import CrochetDashBoard from './CrochetDashBoard';
import { socket } from '../../../socket/socket';

const ProductionDashBoard = () => {
const {user} = useSelector((state)=> state.auth.user);

if (!user) return null;

  if (
    user.role !== "productionSupervisor"
  ) {
    return null;
  }

  return (
    <>
    {user.division === "woven" && user.role==="productionSupervisor" && (<WovenDashBoard/>)}
    {user.division === "crochet" && user.role==="productionSupervisor" && (<CrochetDashBoard/>)}
    </>
  )
}

export default ProductionDashBoard