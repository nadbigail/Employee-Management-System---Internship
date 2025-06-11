import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useState } from 'react'

const InputText = ({ type, defaultValue, updateType, updateFormValue, inputClassName, placeholder }) => {
  return (
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className={inputClassName}
      onChange={(e) => updateFormValue({ updateType, value: e.target.value })}
    />
  )
}

const ErrorText = ({ styleClass, children }) => {
  return <div className={styleClass}>{children}</div>
}

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

    if (userObj.emailId.trim() === "") {
      return setErrorMessage("Email is required!")
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userObj.emailId)) {
      return setErrorMessage("Please enter a valid email address!")
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setLinkSent(true)
    }, 1000)
  }

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("")
    setUserObj({ ...userObj, [updateType]: value })
  }

  const handleLogin = () => {
    window.location.href = '/login'
  }

  const handleRegister = () => {
    window.location.href = '/register'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden bg-white shadow-2xl">

        {/* Left: Logo */}
        <div className="bg-white p-12 flex flex-col justify-center min-h-[700px]">
          <div className="flex items-center justify-center mb-8">
            <img src="/Logo1.png" alt="Logo" className="w-80 object-contain" />
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-[#455A64] p-12 flex flex-col justify-center min-h-[700px] relative">
          {/* Back Button */}
          <button
            onClick={handleLogin}
            className="absolute top-6 left-6 text-white hover:text-orange-400 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-10"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          {linkSent ? (
            <>
              <div className="text-center mb-8">
                <CheckCircle className="inline-block w-32 h-32 text-green-400 mb-4" />
                <h2 className="text-white text-3xl font-bold mb-2">Link Sent</h2>
                <p className="text-gray-300 text-sm">
                  Check your email to reset password
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-white text-3xl font-bold mb-2">Forgot Password</h2>
              <p className="text-gray-300 text-sm mb-8">
                We will send password reset link on your email
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-white block mb-2">Email</label>
                  <InputText
                    type="email"
                    defaultValue={userObj.emailId}
                    updateType="emailId"
                    updateFormValue={updateFormValue}
                    inputClassName="w-full px-4 py-3 bg-gray-200 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
                    placeholder="Enter your email address"
                  />
                </div>

                {errorMessage && (
                  <ErrorText styleClass="text-red-300 text-sm bg-red-900 bg-opacity-20 p-3 rounded-lg">
                    {errorMessage}
                  </ErrorText>
                )}

                <button
                  onClick={submitForm}
                  disabled={loading}
                  className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                  }`}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <div className="text-center text-sm text-gray-300 pt-4">
                  Don't have an account yet?{" "}
                  <button
                    onClick={handleRegister}
                    className="text-orange-400 hover:text-orange-300 font-medium transition-colors bg-transparent border-none cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword