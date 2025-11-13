import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/ResponseHelper';
import { logError, logInfo } from '../utils/logger';
import { ApiResponse } from '../utils/apiResponse';
import { SimHubService } from '../services/simhub.service';
const simhubService = new SimHubService();
export async function getSiapBiFastBisnisList(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("####################################### getSiapBiFastBisnisList");
    const userInfo: any = req.userInfo;
    const paramResult = await simhubService.getSiapBiFastBussinesList();
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
export async function getSiapBiFastBisnisById(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("####################################### getSiapBiFastBisnisById");
    const userInfo: any = req.userInfo;
    const paramResult = await simhubService.getSiapBiFastBussinesList();
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
export async function postSiapBiFastBisnisList(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("####################################### postSiapBiFastBisnisList");
    const userInfo: any = req.userInfo;
    const postResult = await simhubService.postSiapBiFastBussinesList(userInfo,req.body);
    if (postResult.code === 20000) {
      await ResponseHelper.send(res, postResult); return;
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
export async function updSiapBiFastBisnisList(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("####################################### updSiapBiFastBisnisList");
    const userInfo: any = req.userInfo;
    const postResult = await simhubService.updSiapBiFastBussinesList(userInfo,req.body);
    if (postResult.code === 20000) {
      await ResponseHelper.send(res, postResult); return;
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

export async function delSiapBiFastBisnisList(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("####################################### delSiapBiFastBisnisList");
    const userInfo: any = req.userInfo;
    const postResult = await simhubService.delSiapBiFastBussinesList(userInfo,req.body);
    if (postResult.code === 20000) {
      await ResponseHelper.send(res, postResult); return;
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
