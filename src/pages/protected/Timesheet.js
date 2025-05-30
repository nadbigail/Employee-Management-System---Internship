import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Timesheet from '../../features/work/timesheet/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Timesheet"}))
      }, [])


    return(
        <Timesheet />
    )
}

export default InternalPage