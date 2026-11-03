import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getallCycleCompletedPending } from '../../redux/slices/productionSlice';

const CompletedPendingOrders = () => {

        const dispatch = useDispatch();
        const {division} = useSelector((state)=> state.auth?.user?.user)
    React.useEffect(()=>{
        dispatch(getallCycleCompletedPending({division})).unwrap();
    },[dispatch]);

    const {cycleCompletedPending} = useSelector((state)=> state.production);

    console.log("orders coming lala",cycleCompletedPending)

  return (
    <div>Complet</div>
  )
}

export default CompletedPendingOrders