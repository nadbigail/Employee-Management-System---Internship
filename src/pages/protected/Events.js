import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import EventManagementDashboard from "../../features/events";

function InternalPage(){
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title : "Events"}))
  }, [])


  return(
    <EventManagementDashboard />
  )
}

export default InternalPage