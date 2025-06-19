import { useDispatch } from 'react-redux';
import { showNotification } from '../headerSlice';

function ConfirmationModalBody({ extraObject, closeModal }) {
    const dispatch = useDispatch();
    const { message, onConfirm } = extraObject;

    const proceed = () => {
        onConfirm();
        dispatch(showNotification({ message: "Action Confirmed!", status: 1 }));
        closeModal();
    }

    return (
      <>
          <p className='text-xl mt-8 text-center'>
              {message}
          </p>
          <div className="modal-action mt-12">
              <button className="btn btn-outline" onClick={() => closeModal()}>
                  Cancel
              </button>
              <button className="btn btn-primary" onClick={proceed}>
                  Confirm
              </button>
          </div>
      </>
    )
}

export default ConfirmationModalBody;