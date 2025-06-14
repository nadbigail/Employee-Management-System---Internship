import {useEffect} from 'react'
import {MODAL_BODY_TYPES} from '../utils/globalConstantUtil'
import {useSelector, useDispatch} from 'react-redux'
import {closeModal} from '../features/common/modalSlice'
import AddLeadModalBody from '../features/leads/components/AddLeadModalBody'
import ConfirmationModalBody from '../features/common/components/ConfirmationModalBody'
import AddEventModalBody from "../features/calendar/AddEventModalBody";
import AddAttendanceModal from "../features/hr/attendance/AddAttendanceModal";
import AddLeaveModalBody from "../features/hr/leaves/AddLeaveModalBody";
import ManageRegistrationModal from "../features/hr/registration/ManageRegistModal";
import ConfirmationModal from "../features/hr/leaves/Confirmationmodal";


function ModalLayout() {


  const {isOpen, bodyType, size, extraObject, title} = useSelector(state => state.modal)
  const dispatch = useDispatch()

  const close = (e) => {
    dispatch(closeModal(e))
  }


  return (
    <>
      {/* The button to open modal */}

      {/* Put this part before </body> tag */}
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className={`modal-box  ${size === 'lg' ? 'max-w-5xl' : ''}`}>
          <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => close()}>✕</button>
          <h3 className="font-semibold text-2xl pb-6 text-center">{title}</h3>


          {/* Loading modal body according to different modal type */}
          {
            {
              [MODAL_BODY_TYPES.LEAD_ADD_NEW]: <AddLeadModalBody closeModal={close} extraObject={extraObject}/>,
              [MODAL_BODY_TYPES.CONFIRMATION]: <ConfirmationModalBody extraObject={extraObject} closeModal={close}/>,
              [MODAL_BODY_TYPES.EVENT_ADD_NEW]: <AddEventModalBody closeModal={close} extraObject={extraObject}/>,
              [MODAL_BODY_TYPES.ATTENDANCE_ADD_NEW] : <AddAttendanceModal extraObject={extraObject} closeModal={close} />,
              [MODAL_BODY_TYPES.LEAVE_ADD_NEW]: <AddLeaveModalBody closeModal={close} extraObject={extraObject} />,
              [MODAL_BODY_TYPES.MANAGE_REGISTRATION] : <ManageRegistrationModal extraObject={extraObject} closeModal={close} />,
              [MODAL_BODY_TYPES.LEAVE_REQUEST_CONFIRMATION]: <ConfirmationModal extraObject={extraObject} closeModal={close} />,
              [MODAL_BODY_TYPES.DEFAULT]: <div></div>
            }[bodyType]
          }
        </div>
      </div>
    </>
  )
}

export default ModalLayout