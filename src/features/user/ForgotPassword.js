import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import InputText from '../../components/Input/InputText'
import ErrorText from '../../components/Typography/ErrorText'

function ForgotPassword() {
  const INITIAL_USER_OBJ = {
    emailId: "",
  }

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [linkSent, setLinkSent] = useState(false)
  const [userObj, setUserObj] = useState(INITIAL_USER_OBJ)

  const submitForm = (e) => {
    e.preventDefault()
    setErrorMessage("")

    if (userObj.emailId.trim() === "") return setErrorMessage("Email is required!")
    else {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setLinkSent(true)
      }, 1000)
    }
  }

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("")
    setUserObj({ ...userObj, [updateType]: value })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-xl overflow-hidden">

        {/* Kiri: Logo */}
        <div className="flex items-center justify-center bg-white py-20">
          <img src="/Logo1.png" alt="Logo" className="w-90 object-contain" />
        </div>

        {/* Kanan: Form Forgot Password */}
        <div className="bg-[#455A64] p-12 flex flex-col justify-center min-h-[600px]">
          <h2 className="text-white text-2xl font-semibold text-center mb-8">Forgot Password</h2>

          {linkSent ? (
            <>
              <div className="text-center mt-8">
                <CheckCircleIcon className="inline-block w-32 text-success" />
              </div>
              <p className="my-4 text-xl font-bold text-center text-white">Link Sent</p>
              <p className="mt-4 mb-8 font-semibold text-center text-white">
                Check your email to reset password
              </p>
              <div className="text-center mt-4">
                <Link to="/login">
                  <button className="btn btn-block btn-primary">Login</button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="my-8 font-semibold text-center text-white">
                We will send password reset link on your email
              </p>

              <form onSubmit={submitForm}>
                <div className="mb-4">
                  <label className="text-sm text-white block mb-2">Email</label>
                  <InputText
                    type="email"
                    defaultValue={userObj.emailId}
                    updateType="emailId"
                    updateFormValue={updateFormValue}
                    inputClassName="rounded-full px-4 py-2 w-full bg-gray-200"
                  />
                </div>

                <ErrorText styleClass="text-white mb-4">{errorMessage}</ErrorText>

                <button
                  type="submit"
                  className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-full transition duration-200 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <div className="text-center text-sm text-white mt-6">
                  Don't have an account yet?{" "}
                  <Link to="/register" className="text-orange-400 hover:underline">
                    Register
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
