import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import CalendarPage from "../../features/calendar";

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Calendar"}))
      }, [])


    return(
        <CalendarPage />
    )
}

export default InternalPage