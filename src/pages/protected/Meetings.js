import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Meetings from '../../features/meetings/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Meetings"}))}, [])


    return(
        <Meetings />
    )
}

export default InternalPage