import { useState } from 'react'
import InputText from '../../components/Input/InputText'
import SelectInput from '../../components/Input/SelectInput' // Impor komponen baru
import ErrorText from '../../components/Typography/ErrorText'

function Register() {
    const INITIAL_REGISTER_OBJ = {
        firstName: "",
        lastName: "",
        emailId: "",
        password: "",
        department: "",
        contact: ""
    }

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ)

    const departmentOptions = [
        { name: 'Operations', value: 'Operations' },
        { name: 'Marketing & Sales', value: 'Marketing & Sales' },
        { name: 'Finance Accounting & Tax', value: 'Finance Accounting & Tax' },
        { name: 'Human Resources & General Affair', value: 'Human Resources & General Affair' }
    ];

    const submitForm = (e) => {
        e.preventDefault()
        setErrorMessage("")

        if (registerObj.firstName.trim() === "") return setErrorMessage("First name is required!")
        if (registerObj.emailId.trim() === "") return setErrorMessage("Email is required!")
        if (registerObj.password.trim() === "") return setErrorMessage("Password is required!")
        if (registerObj.department.trim() === "") return setErrorMessage("Department is required!")

        setLoading(true)

        try {
            const requests = JSON.parse(localStorage.getItem('registrationRequests')) || [];
            const newUserRequest = {
                id: crypto.randomUUID(),
                ...registerObj,
                registrationDate: new Date().toISOString().split('T')[0],
                status: 'Pending',
            };

            requests.push(newUserRequest);
            localStorage.setItem('registrationRequests', JSON.stringify(requests));

            alert('Registration request submitted! Please wait for admin approval.');
            window.location.href = '/login';

        } catch (error) {
            setErrorMessage("Failed to submit registration. Please try again.");
            console.error("Registration error:", error);
        } finally {
            setLoading(false)
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("")
        setRegisterObj({ ...registerObj, [updateType]: value })
    }

    const handleLogin = () => {
        window.location.href = '/login'
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden bg-white shadow-2xl">
              <div className="bg-white p-12 flex flex-col justify-center min-h-[700px]">
                  <div className="flex items-center justify-center mb-8">
                      <img src="/Logo1.png" alt="Logo" className="w-80 object-contain" />
                  </div>
              </div>
              <div className="bg-[#455A64] p-12 flex flex-col justify-center min-h-[700px]">
                  <h2 className="text-white text-3xl font-bold mb-2">Create Account</h2>
                  <p className="text-gray-300 text-sm mb-8">Fill in your information to get started</p>
                  <form onSubmit={submitForm}>
                      <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <InputText type="text" defaultValue={registerObj.firstName} updateType="firstName" updateFormValue={updateFormValue} placeholder="First Name" inputClassName="w-full px-4 py-3 bg-gray-200 rounded-xl focus:ring-orange-400" />
                              <InputText type="text" defaultValue={registerObj.lastName} updateType="lastName" updateFormValue={updateFormValue} placeholder="Last Name" inputClassName="w-full px-4 py-3 bg-gray-200 rounded-xl focus:ring-orange-400" />
                          </div>
                          <InputText type="email" defaultValue={registerObj.emailId} updateType="emailId" updateFormValue={updateFormValue} placeholder="Email Address" inputClassName="w-full px-4 py-3 bg-gray-200 rounded-xl focus:ring-orange-400" />
                          <InputText type="password" defaultValue={registerObj.password} updateType="password" updateFormValue={updateFormValue} placeholder="Password" inputClassName="w-full px-4 py-3 bg-gray-200 rounded-xl focus:ring-orange-400" />

                          <SelectInput
                            name="department"
                            options={departmentOptions}
                            defaultValue={registerObj.department}
                            updateType="department"
                            updateFormValue={updateFormValue}
                            placeholder="Select Department"
                          />

                          <InputText type="text" defaultValue={registerObj.contact} updateType="contact" updateFormValue={updateFormValue} placeholder="Contact Number (Optional)" inputClassName="w-full px-4 py-3 bg-gray-200 rounded-xl focus:ring-orange-400" />

                          {errorMessage && (<ErrorText styleClass="text-red-300 text-sm bg-red-900 bg-opacity-20 p-3 rounded-lg">{errorMessage}</ErrorText>)}

                          <button type="submit" disabled={loading} className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                              {loading ? "Submitting..." : "Create Account"}
                          </button>
                          <div className="text-center text-sm text-gray-300 pt-4">
                              Already have an account?{" "}
                              <button type="button" onClick={handleLogin} className="text-orange-400 hover:text-orange-300 font-medium transition-colors bg-transparent border-none cursor-pointer">
                                  Sign In
                              </button>
                          </div>
                      </div>
                  </form>
              </div>
          </div>
      </div>
    )
}

export default Register