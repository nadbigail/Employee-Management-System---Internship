import { useState } from 'react'
import { Link } from 'react-router-dom'
import InputText from '../../components/Input/InputText'
import ErrorText from '../../components/Typography/ErrorText'

function Login() {
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

        if (loginObj.emailId.trim() === "")
            return setErrorMessage("Email is required!")
        if (loginObj.password.trim() === "")
            return setErrorMessage("Password is required!")
        else {
            setLoading(true)
            localStorage.setItem("token", "DumyTokenHere")
            setLoading(false)
            window.location.href = '/app/dashboard'
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("")
        setLoginObj({ ...loginObj, [updateType]: value })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-xl overflow-hidden">

                
                {/* Kiri: Logo */}
                <div className="flex items-center justify-center bg-white py-20">
                    <img src="/Logo1.png" alt="Logo" className="w-90 object-contain" />
                </div>

                {/* Kanan: Form Login */}
                <div className="bg-[#455A64] p-12 flex flex-col justify-center min-h-[600px]">
                    <h2 className="text-white text-2xl font-semibold text-center mb-8">Login</h2>

                    <form onSubmit={submitForm}>
                        <div className="mb-4">
                            <label className="text-sm  text-white block mb-2">Email</label>
                            <InputText
                                type="email"
                                defaultValue={loginObj.emailId}
                                updateType="emailId"
                                updateFormValue={updateFormValue}
                                inputClassName="rounded-full px-4 py-2 w-full bg-gray-200"
                            />
                        </div>

                        <div className="mb-4">
                            <label className=" text-sm text-white block mb-2">Password</label>
                            <InputText
                                type="password"
                                defaultValue={loginObj.password}
                                updateType="password"
                                updateFormValue={updateFormValue}
                                inputClassName="rounded-full px-4 py-2 w-full bg-gray-200"
                            />
                        </div>

                        <div className="text-right mb-4">
                            <Link to="/forgot-password" className="text-sm text-white hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <ErrorText styleClass="text-white mb-4">{errorMessage}</ErrorText>

                        <button
                            type="submit"
                            className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-full transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <div className="text-center text-sm text-white mt-6">
                            Don't have an account yet? <Link to="/register" className="text-orange-400 hover:underline">Register</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
