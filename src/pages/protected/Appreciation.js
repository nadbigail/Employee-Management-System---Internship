import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AppreciationDashboard from "../../features/hr/appreciation";

function InternalPage(){
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title : "Appreciation"}))
  }, [])


  return(
    <AppreciationDashboard />
  )
}

export default InternalPage