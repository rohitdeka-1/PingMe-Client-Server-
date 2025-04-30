import express from "express"
import {handleUserRegister} from "../controllers/Auth/register.controller"
import { inputValidationError, loginInputValidator, registrationInputValidator } from "../middlewares/authValidator.middleware";
import { handleUserLogin } from "../controllers/Auth/login.controller";
import { handleUserLogout } from "../controllers/Auth/logout.controller";
import { handleSendResetMail } from "../controllers/Auth/reset.controller";
import { resetPassPagevalidation } from "../controllers/Auth/resetPassPagevalidation";
const authRoute = express.Router();

authRoute.post("/register",registrationInputValidator,inputValidationError,handleUserRegister)
authRoute.post("/login",loginInputValidator,inputValidationError,handleUserLogin)
authRoute.post("/logout",handleUserLogout);
authRoute.post("/reset",handleSendResetMail);
authRoute.get("/resetpassword/:token",resetPassPagevalidation)
export default authRoute;
