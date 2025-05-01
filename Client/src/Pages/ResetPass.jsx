"use client"

import { useEffect, useState } from "react"
import Form from "../Components/Auth/Form"
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import axios from "axios"
import axiosInstance from "../utils/axiosInstance";


const ResetPass = () => {
  const [pass1, setPass1] = useState("")
  const [pass2, setPass2] = useState("")
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [passwordError, setPasswordError] = useState("")
  const { token } = useParams()
  const [validToken, setValidToken] = useState(null)
  const navigate = useNavigate()
  const backendURI = import.meta.env.VITE_BACKEND_URI

  useEffect(() => {
    const validateToken = async () => {
      try {
        setValidating(true)
        const response = await axios.get(`${backendURI}/api/v1/auth/resetpassword/${token}`)
        if (response.data.success) {
          setValidToken(response.data.success)
        }
      } catch (err) {
        setValidToken(false)
        toast.error("Invalid or expired reset link.")
        console.error("Err : ", err)
      } finally {
        setValidating(false)
      }
    }
    validateToken()
  }, [token, backendURI])

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long"
    }
    return ""
  }

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target

    if (name === "password1") {
      setPass1(value)
      setPasswordError(validatePassword(value))
    } else if (name === "password2") {
      setPass2(value)
      if (value !== pass1) {
        setPasswordError("Passwords do not match")
      } else {
        setPasswordError("")
      }
    }
  }

  const handleSubmit = async () => {
    // Validate passwords before submission
    if (pass1 !== pass2) {
      setPasswordError("Passwords do not match")
      return
    }

    const error = validatePassword(pass1)
    if (error) {
      setPasswordError(error)
      return
    }

    setLoading(true)
    const url = `${backendURI}/api/v1/auth/resetpassword/${token}`

    console.log("Making request to:", url)

    try {
      const res = await axios.post(url, {
        password1: pass1,
        password2: pass2,
      })

      console.log("Response:", res.data)

      if (res.data.success) {
        toast.success("Password updated successfully!")
        // Redirect to login page after successful password reset
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      }
    } catch (err) {
      console.error("Error in ResetPass: ", err)
      console.error("Error details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
      })

      const errorMessage = err.response?.data?.message || "Failed to reset password. Please try again."
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="text-white bg-[#161717] min-h-screen flex justify-center items-center text-center">
        <div className="animate-pulse">Validating reset link...</div>
      </div>
    )
  }

  if (validToken === false) {
    return (
      <div className="text-red-600 bg-[#161717] flex flex-col gap-4 justify-center items-center min-h-screen text-center">
        <p>Invalid or expired token.</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    )
  }

  return (
    <div className="text-white min-h-screen bg-[#161717] p-6 flex flex-col justify-center">
      <h1 className="flex justify-center tracking-[2px] font-geist font-bold text-3xl mb-6">PingMe</h1>
      <div>
        <Form
          btnLabel={loading ? "Resetting..." : "Reset Password"}
          onClick={handleSubmit}
          disabled={loading || !!passwordError}
        >
          <div className="space-y-4">
            <div>
              <input
                type="password"
                name="password1"
                onChange={handleChange}
                value={pass1}
                placeholder="New Password"
                className="bg-transparent p-3 w-full text-white rounded-xl outline-blue-400 border border-gray-700"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters long</p>
            </div>

            <input
              type="password"
              name="password2"
              onChange={handleChange}
              value={pass2}
              placeholder="Confirm Password"
              className="bg-transparent p-3 w-full text-white rounded-xl outline-blue-400 border border-gray-700"
              required
              disabled={loading}
            />

            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          </div>
        </Form>
      </div>
      <div>
        <p className="text-green-600 p-3 text-center">Do remember the password this time :)</p>
      </div>
    </div>
  )
}

export default ResetPass
