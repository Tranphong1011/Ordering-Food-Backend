import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { ExplainVerbosity } from "mongodb";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res.sendStatus(401); // unauthorized access
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload; // decode and extract its payload - ts type assertion
    const auth0Id = decoded.sub;
    const user = await User.findOne({ auth0Id }); // shorthand syntax for { auth0Id: auth0Id } when property name and the variable name are the same
    if (!user) {
      return res.sendStatus(401);
    }
    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    next(); // will call updateCurrentUser
  } catch (err) {
    return res.sendStatus(401); // unauthorized access
  }
};
