import React from 'react';
import { Check, X } from 'lucide-react';

function ConfirmationModal({ extraObject, closeModal }) {
  const { message, onConfirm } = extraObject;

  return (
    <>
      <p className='text-xl mt-8 text-center'>
        {message}
      </p>
      <div className="modal-action mt-12">
        <button className="btn btn-outline" onClick={() => closeModal()}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={() => {
          onConfirm();
          closeModal();
        }}>
          Yes
        </button>
      </div>
    </>
  )
}

export default ConfirmationModal;