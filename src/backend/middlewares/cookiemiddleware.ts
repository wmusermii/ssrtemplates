/// <reference path="../types/express/index.d.ts" />
import { Request, Response, NextFunction  } from "express";
import { EncryptDecryptJwt } from "../utils/encryptdecryptJwt";
import { ResponseHelper } from "../utils/ResponseHelper";
import { ApiResponse } from "../utils/apiResponse";
import { tokenBlacklist } from "../utils/tokenBlacklist";
import { logError, logInfo, logWarn } from "../utils/logger";
import { ParamRepository } from "../repositories/param.repository";

export async function CookieMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // console.log("COOKIE TOKEN ",xtoken);
    const paramRepo = new ParamRepository().findParamByKey({ paramgroup: 'GENERAL', paramkey: 'useLogin' });
    console.log(await paramRepo);
    if (await paramRepo.then(f => f.paramvalue) == 'false') {
      console.log('GAK PAKE LOGIN!!!!!!!!');
      req.authInfo = {useLogin: 'false'}
      next();
    }else{
      const xtoken = req.signedCookies?.["x_token"]; // Ambil token dari signed cookie
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

    }

  } catch (error) {
    logError(`CookieMiddleware error : ${error}`);
    return ResponseHelper.send(res, ApiResponse.serviceUnauthorised("Unauthorized"));
  }

}
