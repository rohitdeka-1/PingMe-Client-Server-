import express from "express"
import {
  inputValidationError,
  loginInputValidator,
  registrationInputValidator,
} from "../middlewares/validation/authValidator.middleware"
import {
  changePassword,
  handleSendResetMail,
  handleUserLogin,
  handleUserLogout,
  handleUserRegister,
} from "../controllers/auth.controller"
import { resetPassPagevalidation } from "../middlewares/resetValidate"

const authRoute = express.Router()

authRoute.post("/register", registrationInputValidator, inputValidationError, handleUserRegister)
authRoute.post("/login", loginInputValidator, inputValidationError, handleUserLogin)
authRoute.post("/logout", handleUserLogout)
authRoute.post("/reset", handleSendResetMail)
authRoute.get("/resetpassword/:token", resetPassPagevalidation)
authRoute.post("/resetpassword/:token", changePassword)



export default authRoute
