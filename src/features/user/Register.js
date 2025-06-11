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

function Register() {
    const INITIAL_REGISTER_OBJ = {
        firstName: "",
        lastName: "",
        emailId: "",
        password: "",
        confirmPassword: ""
    }

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ)

    const submitForm = (e) => {
        e.preventDefault()
        setErrorMessage("")

        if (registerObj.firstName.trim() === "")
            return setErrorMessage("First name is required!")
        if (registerObj.lastName.trim() === "")
            return setErrorMessage("Last name is required!")
        if (registerObj.emailId.trim() === "")
            return setErrorMessage("Email is required!")
        if (registerObj.password.trim() === "")
            return setErrorMessage("Password is required!")
        if (registerObj.confirmPassword.trim() === "")
            return setErrorMessage("Confirm password is required!")
        if (registerObj.password !== registerObj.confirmPassword)
            return setErrorMessage("Passwords do not match!")

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(registerObj.emailId))
            return setErrorMessage("Please enter a valid email address!")

        // Password strength validation
        if (registerObj.password.length < 6)
            return setErrorMessage("Password must be at least 6 characters long!")

        setLoading(true)
        setTimeout(() => {
            try {
                console.log('Registration successful - would redirect to dashboard')
                alert('Registration successful! In your real app, this will redirect to /app/dashboard')
                setLoading(false)
            } catch (error) {
                console.log('Registration successful - would redirect to dashboard')
                alert('Registration successful! In your real app, this will redirect to /app/dashboard')
                setLoading(false)
            }
        }, 1000)
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("")
        setRegisterObj({ ...registerObj, [updateType]: value })
    }

    const handleLogin = () => {
        window.location.href = '/login'
    }

    const handleTerms = () => {
        window.location.href = '/terms'
    }

    const handlePrivacy = () => {
        window.location.href = '/privacy'
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
              <div className="bg-[#455A64] p-12 flex flex-col justify-center min-h-[700px]">
                  <h2 className="text-white text-3xl font-bold mb-2">Create Account</h2>
                  <p className="text-gray-300 text-sm mb-8">Fill in your information to get started</p>

                  <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="text-sm font-medium text-white block mb-2">First Name</label>
                              <InputText
                                type="text"
                                defaultValue={registerObj.firstName}
                                updateType="firstName"
                                updateFormValue={updateFormValue}
                                inputClassName="w-full px-4 py-3 bg-gray-200 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
                                placeholder="Enter first name"
                              />
                          </div>

                          <div>
                              <label className="text-sm font-medium text-white block mb-2">Last Name</label>
                              <InputText
                                type="text"
                                defaultValue={registerObj.lastName}
                                updateType="lastName"
                                updateFormValue={updateFormValue}
                                inputClassName="w-full px-4 py-3 bg-gray-200 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
                                placeholder="Enter last name"
                              />
                          </div>
                      </div>

                      <div>
                          <label className="text-sm font-medium text-white block mb-2">Email</label>
                          <InputText
                            type="email"
                            defaultValue={registerObj.emailId}
                            updateType="emailId"
                            updateFormValue={updateFormValue}
                            inputClassName="w-full px-4 py-3 bg-gray-200 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
                            placeholder="Enter your email address"
                          />
                      </div>

                      <div>
                          <label className="text-sm font-medium text-white block mb-2">Password</label>
                          <InputText
                            type="password"
                            defaultValue={registerObj.password}
                            updateType="password"
                            updateFormValue={updateFormValue}
                            inputClassName="w-full px-4 py-3 bg-gray-200 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
                            placeholder="Create a password"
                          />
                      </div>

                      <div>
                          <label className="text-sm font-medium text-white block mb-2">Confirm Password</label>
                          <InputText
                            type="password"
                            defaultValue={registerObj.confirmPassword}
                            updateType="confirmPassword"
                            updateFormValue={updateFormValue}
                            inputClassName="w-full px-4 py-3 bg-gray-200 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
                            placeholder="Confirm your password"
                          />
                      </div>

                      <div className="flex items-center">
                          <input type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-400" required />
                          <span className="ml-2 text-sm text-gray-300">
                                I agree to the{" "}
                              <button onClick={handleTerms} className="text-orange-400 hover:text-orange-300 underline bg-transparent border-none cursor-pointer">
                                    Terms of Service
                                </button>{" "}
                              and{" "}
                              <button onClick={handlePrivacy} className="text-orange-400 hover:text-orange-300 underline bg-transparent border-none cursor-pointer">
                                    Privacy Policy
                                </button>
                            </span>
                      </div>

                      {errorMessage && (
                        <ErrorText styleClass="text-red-300 text-sm bg-red-900 bg-opacity-20 p-3 rounded-lg">{errorMessage}</ErrorText>
                      )}

                      <button
                        onClick={submitForm}
                        disabled={loading}
                        className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 ${
                          loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                        }`}
                      >
                          {loading ? "Creating Account..." : "Create Account"}
                      </button>

                      <div className="text-center text-sm text-gray-300 pt-4">
                          Already have an account?{" "}
                          <button
                            onClick={handleLogin}
                            className="text-orange-400 hover:text-orange-300 font-medium transition-colors bg-transparent border-none cursor-pointer"
                          >
                              Sign In
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    )
}

export default Register