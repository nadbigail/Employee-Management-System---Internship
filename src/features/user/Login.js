import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from './userSlice'

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

function Login() {
    const dispatch = useDispatch()

    const INITIAL_LOGIN_OBJ = {
        password: "",
        emailId: ""
    }

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ)

    const submitForm = (e) => {
        e.preventDefault()
        setErrorMessage("")

        if (loginObj.emailId.trim() === "") return setErrorMessage("Email is required!")
        if (loginObj.password.trim() === "") return setErrorMessage("Password is required!")

        const validUsers = {
            "admin@example.com": { password: "password", role: "admin", name: "Admin", token: "adminToken" },
            "nadine@example.com": { password: "password", role: "employee", name: "Nadine Abigail", token: "nadineToken" },
            "sara@example.com": { password: "password", role: "employee", name: "Sara Nadya", token: "saraToken" },
            "eunike@example.com": { password: "password", role: "employee", name: "Eunike Alfrita Maharani", token: "eunikeToken" }
        };

        const user = validUsers[loginObj.emailId];

        if (!user || user.password !== loginObj.password) {
            return setErrorMessage("Invalid credentials! Please use a valid email and password.");
        }

        setLoading(true)
        setTimeout(() => {
            dispatch(setUser({ token: user.token, role: user.role, name: user.name }));
            window.location.href = '/app/dashboard';
            setLoading(false);
        }, 1000);
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("")
        setLoginObj({ ...loginObj, [updateType]: value })
    }

    const handleRegister = () => {
        window.location.href = '/register'
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden bg-white shadow-2xl">
              <div className="bg-white p-12 flex flex-col justify-center min-h-[700px]">
                  <div className="flex items-center justify-center mb-8">
                      <img src="/Logo1.png" alt="Logo" className="w-80 object-contain" />
                  </div>
              </div>
              <div className="bg-[#455A64] p-12 flex flex-col justify-center min-h-[600px]">
                  <h2 className="text-white text-3xl font-bold mb-2">Welcome back!</h2>
                  <p className="text-gray-300 text-sm mb-4">
                      Login with credentials. (password: <span className='font-bold'>password</span>)
                  </p>
                  <div className="space-y-6">
                      <div>
                          <label className="text-sm font-medium text-white block mb-2">Email</label>
                          <InputText
                            type="email"
                            defaultValue={loginObj.emailId}
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
                            defaultValue={loginObj.password}
                            updateType="password"
                            updateFormValue={updateFormValue}
                            inputClassName="w-full px-4 py-3 bg-gray-200 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
                            placeholder="Enter your password"
                          />
                      </div>
                      {errorMessage && (
                        <ErrorText styleClass="text-red-300 text-sm bg-red-900 bg-opacity-20 p-3 rounded-lg">{errorMessage}</ErrorText>
                      )}
                      <button
                        onClick={submitForm}
                        disabled={loading}
                        className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}>
                          {loading ? "Signing in..." : "Login"}
                      </button>
                      <div className="text-center text-sm text-gray-300 pt-4">
                          Don't have an account? {' '}
                          <button onClick={handleRegister} className="text-orange-400 hover:text-orange-300 font-medium transition-colors bg-transparent border-none cursor-pointer">
                              Register
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    )
}

export default Login