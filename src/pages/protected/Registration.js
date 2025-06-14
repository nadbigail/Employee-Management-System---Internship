import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import RegistrationDashboard from "../../features/hr/registration";

function InternalPage(){
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title : "Registration Requests"}))
  }, [])

  return(
    <RegistrationDashboard />
  )
}

export default InternalPage