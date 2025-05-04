import express, { Request,Response,NextFunction, Router } from "express";
import User from "../models/user.model";
import { handleSearch } from "../controllers/search.controller";

const searchRoute = Router();

searchRoute.get("/",handleSearch);
  

export default searchRoute;