/// <reference path="../types/express/index.d.ts" />
import { Request, Response, NextFunction  } from "express";
import { EncryptDecryptJwt } from "../utils/encryptdecryptJwt";
import { ResponseHelper } from "../utils/ResponseHelper";
import { ApiResponse } from "../utils/apiResponse";
import { tokenBlacklist } from "../utils/tokenBlacklist";
import { logError, logInfo, logWarn } from "../utils/logger";
export async function CookieMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const xtoken = req.signedCookies?.["x_token"]; // Ambil token dari signed cookie
    // console.log("COOKIE TOKEN ",xtoken);
    if (!xtoken) {
        return ResponseHelper.send(res, ApiResponse.serviceUnauthorised('Unauthorized - No token provided'));
    }
    try {
        const decoded = await EncryptDecryptJwt.verifyToken(xtoken)
        req.userInfo = decoded; // Attach decoded payload ke request object
        next();
      } catch (err) {
        const optionCookie:any[]=[
          {
            name: 'x_token',
            value: null,
            options: {
              httpOnly: true,   // Melindungi dari akses JavaScript
              secure: false,     // Hanya dikirim melalui HTTPS jika true
              signed:true,
              sameSite: 'strict'
            }
          }
        ]
        return ResponseHelper.sendClearCookies(res, ApiResponse.invalidToken('Forbidden - Invalid token'), optionCookie);
      }
  } catch (error) {
    logError(`CookieMiddleware error : ${error}`);
    return ResponseHelper.send(res, ApiResponse.serviceUnauthorised("Unauthorized"));
  }

}
