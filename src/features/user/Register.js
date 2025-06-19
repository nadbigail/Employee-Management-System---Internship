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

const SelectInput = ({ name, options, defaultValue, updateType, updateFormValue, placeholder }) => {
  return (
    <select
      name={name}
      value={defaultValue}
      onChange={(e) => updateFormValue({ updateType, value: e.target.value })}
      className="w-full px-4 py-3 bg-gray-200 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
    >
      <option value="" disabled className="text-gray-500">
        {placeholder}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option.value} className="text-gray-900">
          {option.name}
        </option>
      ))}
    </select>
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
            // Simulate registration request storage
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
                  <p className="text-gray-300 text-sm mb-4">Fill in your information to get started</p>
                  <form onSubmit={submitForm}>
                      <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                  <label className="text-sm font-medium text-white block mb-2">First Name</label>
                                  <InputText 
                                      type="text" 
                                      defaultValue={registerObj.firstName} 
                                      updateType="firstName" 
                                      updateFormValue={updateFormValue} 
                                      placeholder="Enter your first name" 
                                      inputClassName="w-full px-4 py-3 bg-gray-200 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" 
                                  />
                              </div>
                              <div>
                                  <label className="text-sm font-medium text-white block mb-2">Last Name</label>
                                  <InputText 
                                      type="text" 
                                      defaultValue={registerObj.lastName} 
                                      updateType="lastName" 
                                      updateFormValue={updateFormValue} 
                                      placeholder="Enter your last name" 
                                      inputClassName="w-full px-4 py-3 bg-gray-200 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" 
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
                                  placeholder="Enter your email address" 
                                  inputClassName="w-full px-4 py-3 bg-gray-200 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" 
                              />
                          </div>
                          
                          <div>
                              <label className="text-sm font-medium text-white block mb-2">Password</label>
                              <InputText 
                                  type="password" 
                                  defaultValue={registerObj.password} 
                                  updateType="password" 
                                  updateFormValue={updateFormValue} 
                                  placeholder="Enter your password" 
                                  inputClassName="w-full px-4 py-3 bg-gray-200 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" 
                              />
                          </div>

                          <div>
                              <label className="text-sm font-medium text-white block mb-2">Department</label>
                              <SelectInput
                                name="department"
                                options={departmentOptions}
                                defaultValue={registerObj.department}
                                updateType="department"
                                updateFormValue={updateFormValue}
                                placeholder="Select Department"
                              />
                          </div>

                          <div>
                              <label className="text-sm font-medium text-white block mb-2">Contact Number</label>
                              <InputText 
                                  type="text" 
                                  defaultValue={registerObj.contact} 
                                  updateType="contact" 
                                  updateFormValue={updateFormValue} 
                                  placeholder="Enter your contact number (optional)" 
                                  inputClassName="w-full px-4 py-3 bg-gray-200 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" 
                              />
                          </div>

                          {errorMessage && (
                              <ErrorText styleClass="text-red-300 text-sm bg-red-900 bg-opacity-20 p-3 rounded-lg">
                                  {errorMessage}
                              </ErrorText>
                          )}

                          <button 
                              type="submit" 
                              disabled={loading} 
                              className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
                          >
                              {loading ? "Submitting..." : "Create Account"}
                          </button>
                          
                          <div className="text-center text-sm text-gray-300 pt-4">
                              Already have an account?{" "}
                              <button 
                                  type="button" 
                                  onClick={handleLogin} 
                                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors bg-transparent border-none cursor-pointer"
                              >
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