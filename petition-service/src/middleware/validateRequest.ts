import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import jwt from "jsonwebtoken";
import { Buffer } from "buffer";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // const authHeader = req.headers.authorization;
    // const SECRET_KEY = process.env.JWT_SECRET;

    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   res.status(401).json({ error: "Unauthorized: No token provided" });
    //   return;
    // }

    // const token = authHeader.split(" ")[1];
    // try {
    //   if (!SECRET_KEY) {
    //     res
    //       .status(500)
    //       .json({ error: "Internal server error: Missing JWT secret" });
    //     return;
    //   }
    //   const key = Buffer.from(SECRET_KEY, "base64");
    //   const decoded = jwt.verify(token, key) as unknown as {
    //     sub: string;
    //     exp: number;
    //   };
    //   console.log(decoded);
    //   if (!decoded.sub || !decoded.exp) {
    //     res.status(401).json({ error: "Unauthorized: Invalid token" });
    //     return;
    //   }

    //   // Check token expiration
    //   if (decoded.exp * 1000 < Date.now()) {
    //     res.status(401).json({ error: "Unauthorized: Token expired" });
    //     return;
    //   }

    //   req.user = { email: decoded.sub };
    // } catch (error: any) {
    //   if (error.name === "TokenExpiredError") {
    //     res.status(401).json({ error: "Unauthorized: Token expired" });
    //     return;
    //   }
    //   if (error.name === "JsonWebTokenError") {
    //     res.status(401).json({ error: "Unauthorized: Invalid token" });
    //     return;
    //   }
    //   res.status(500).json({ error: "Internal server error" });
    //   return;
    // }

    const result = schema.safeParse(req);

    if (!result.success) {
      res.status(400).json({ errors: result.error.errors });
      console.log(result.error.errors);
      console.log(req.body);
      return; // Ensure function ends after sending response
    }

    next(); // Continue if validation passes
  };
};

declare module "express-serve-static-core" {
  interface Request {
    user?: { email: string };
  }
}
