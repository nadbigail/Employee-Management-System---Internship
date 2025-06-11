import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AppreciationDashboard from "../../features/hr/appreciation";
import EmployeeLeavesDashboard from "../../features/hr/leaves";
import AttendanceDashboard from "../../features/hr/attendance";

function InternalPage(){
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title : "Attendance" }))
  }, [])


  return(
    <AttendanceDashboard />
  )
}

export default InternalPage