import { checkSchema, validationResult } from "express-validator";
import express, { Request, Response, NextFunction } from "express";

export const registrationInputValidator = checkSchema({
  username: {
    notEmpty: {
      errorMessage: "Username is required",
      bail: true,
    },
    isString: {
      errorMessage: "Invalid Username",
      bail: true,
    },
    isLength: {
      options: {
        max: 25,
      },
      errorMessage: "Username is too lengthy",
      bail: true,
    },
    trim: true,
  },
  email: {
    notEmpty: {
      errorMessage: "Username is required",
      bail: true,
    },
    isEmail: {
      errorMessage: "Invalid Email",
      bail: true,
    },

    trim: true,
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required",
      bail: true,
    },
    isString: {
      errorMessage: "Password must be a string",
      bail: true,
    },
    isLength: {
      options: {
        min: 6,
      },
      errorMessage: "Password too short",
    },
  },
  fullname: {
    notEmpty: {
      errorMessage: "Fullname is required",
    },
    isString: {
      errorMessage: "Fullname should be strictly string",
    },
  },
});

export const loginInputValidator = checkSchema({
  identity: {
    notEmpty: {
      errorMessage: "Username/Email is required",
    },
    isString: {
      errorMessage: "Username should be strictly string",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required",
    },
    isLength: {
      options: {
        min: 4,
      },
      errorMessage: "Password too short",
    },
  },
});

export const inputValidationError = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      message: "Input not valid",
      error: errors.array(),
    });
    return;
  }
  next();
};
