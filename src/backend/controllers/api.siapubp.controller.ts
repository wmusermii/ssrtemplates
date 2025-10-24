import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/ResponseHelper';
import { logError, logInfo } from '../utils/logger';
import { ApiResponse } from '../utils/apiResponse';
import { SimHubService } from '../services/simhub.service';
const simhubService = new SimHubService();
export async function getSiapUbpTableFields(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("####################################### getSiapUbpTableFields");
    const userInfo: any = req.userInfo;
    const paramResult = await simhubService.getSiapUbpTableFields();
    if (paramResult.code === 20000) {
      await ResponseHelper.send(res, paramResult); return;
    } else {
      await ResponseHelper.send(res, ApiResponse.successNoData([], "Unable to generate data"));
      return;
    }
  } catch (error) {
    logError("Error api.controller : ", error)
    // next(error);
    return await ResponseHelper.send(res, ApiResponse.serverError(error + "")); return;
  }
}
export async function getSiapUbpFormModel(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("####################################### getSiapUbpFormModel");
    const userInfo: any = req.userInfo;
    const paramResult = await simhubService.getSiapUbpFormModel();
    if (paramResult.code === 20000 && paramResult.data.length > 0) {
      await ResponseHelper.send(res, paramResult); return;
    } else {
      await ResponseHelper.send(res, ApiResponse.successNoData([], "Unable to generate data"));
      return;
    }
  } catch (error) {
    logError("Error api.controller : ", error)
    // next(error);
    return await ResponseHelper.send(res, ApiResponse.serverError(error + "")); return;
  }
}
export async function getSiapUbpCompanies(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("####################################### getCompanies");
    const userInfo: any = req.userInfo;
    const paramResult = await simhubService.getSiapUbpCompanies();


    if (paramResult.code === 20000) {
      await ResponseHelper.send(res, paramResult); return;
    } else {
      await ResponseHelper.send(res, ApiResponse.successNoData([], "Unable to generate data"));
      return;
    }
  } catch (error) {
    logError("Error api.controller : ", error)
    // next(error);
    return await ResponseHelper.send(res, ApiResponse.serverError(error + "")); return;
  }
}
export async function getSiapUbpCompanieBy(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("####################################### getCompanieBy");
    const userInfo: any = req.userInfo;
    const paramResult = await simhubService.getSiapUbpTableFields();
    if (paramResult.code === 20000 && paramResult.data.length > 0) {
      await ResponseHelper.send(res, paramResult); return;
    } else {
      await ResponseHelper.send(res, ApiResponse.successNoData([], "Unable to generate data"));
      return;
    }
  } catch (error) {
    logError("Error api.controller : ", error)
    // next(error);
    return await ResponseHelper.send(res, ApiResponse.serverError(error + "")); return;
  }
}
