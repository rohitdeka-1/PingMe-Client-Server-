import express from "express"
import {handleUserRegister} from "../controllers/Auth/register.controller"
import { inputValidationError, loginInputValidator, registrationInputValidator } from "../middlewares/authValidator.middleware";
import { handleUserLogin } from "../controllers/Auth/login.controller";
import { handleUserLogout } from "../controllers/Auth/logout.controller";
const authRoute = express.Router();

authRoute.post("/register",registrationInputValidator,inputValidationError,handleUserRegister)
authRoute.post("/login",loginInputValidator,inputValidationError,handleUserLogin)
authRoute.post("/logout",handleUserLogout);

export default authRoute;
