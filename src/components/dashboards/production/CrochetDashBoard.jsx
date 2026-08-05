import React from 'react'
import {useDispatch,useSelector} from 'react-redux';
import useNotification from '../../../hooks/useNotification';
import {getAllProductions} from '../../../redux/slices/productionSlice';
import ProcessSummaryCards from '../../production/ProcessSummaryCards';

const CrochetDashBoard = ({division}) => {
  const dispatch = useDispatch();

  const {user} = useSelector((state)=> state.auth.user);
  const currentDivision = user?.division;

  React.useEffect(()=>{
    if(!currentDivision){
      return;
    }
    dispatch(getAllProductions(currentDivision));
  },[dispatch,currentDivision]);

  // notification hook
    useNotification({
        event: "new-woven-notification",
        refetch: ()=>getAllProductions(currentDivision),
    });

    // get data from redux store
      const {
        allProductionOrders = [],
    
        allOrdersLoading = false,
    
        error = null,
      } = useSelector((state) => state.production);
   
  return (
    <div>
      
            {/* SUMMARY CARDS */}
      
            <ProcessSummaryCards
              rows={allProductionOrders}
              loading={allOrdersLoading}
              division={currentDivision}
            />
    </div>
  )
}

export default CrochetDashBoard;
 