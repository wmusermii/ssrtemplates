/// <reference path="../types/express/index.d.ts" />
import { Request, Response, NextFunction } from "express";
import { EncryptDecryptJwt } from "../utils/encryptdecryptJwt";
import { ResponseHelper } from "../utils/ResponseHelper";
import { ApiResponse } from "../utils/apiResponse";
import { tokenBlacklist } from "../utils/tokenBlacklist";
import { logError, logInfo, logWarn } from "../utils/logger";
export async function authBearerMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const originalURL = req.originalUrl;
    // logWarn(req.headers)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logWarn("Invalid or unavailable token");
      return ResponseHelper.send(res, ApiResponse.invalidToken("Invalid or unavailable token"));
    }
    const token = authHeader.split(" ")[1];
    if (tokenBlacklist.includes(token)) {
      logWarn("Token has been revoked");
      return ResponseHelper.send(res, ApiResponse.serviceUnauthorised("Token has been revoked"));
    }
    const decoded = await EncryptDecryptJwt.verifyToken(token);
    // logInfo("HASIL VERIFIED ",decoded);
    if (!decoded) {
      // logInfo("TERMASUK DI DECODED NGGA BISA KARENA EXPIRED");
      logWarn("Invalid or expired token");
      return ResponseHelper.send(res, ApiResponse.invalidToken("Invalid or expired token"));
    }
    //################ Check Lagi di akses dari mana
    const ua = req.headers['user-agent'];
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (decoded.ua !== ua || decoded.ip !== ip) {
      return ResponseHelper.send(res, ApiResponse.serviceUnauthorised("Token misuse detected"));
    }
    //################ Check X-CLIENT ########
    const clientHeader = req.headers['x-client'];
    console.log("MIDDLE WARE X CLIENT ", clientHeader);
    if (clientHeader !== 'angular-ssr') {
      return ResponseHelper.send(res, ApiResponse.serviceUnauthorised("Invalid client"));
    }

    (req as any).userInfo = decoded;// Simpan user ke request agar bisa digunakan di handler berikutnya
    next();
  } catch (error) {
    logError(`Authmiddleware error : ${error}`);
    return ResponseHelper.send(res, ApiResponse.serviceUnauthorised("Unauthorized"));
  }
}
