import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AppreciationDashboard from "../../features/hr/appreciation";
import EmployeeLeavesDashboard from "../../features/hr/leaves";

function InternalPage(){
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title : "Leaves"}))
  }, [])


  return(
    <EmployeeLeavesDashboard />
  )
}

export default InternalPage