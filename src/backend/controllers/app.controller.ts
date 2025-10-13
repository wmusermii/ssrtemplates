import { Request, Response, NextFunction } from 'express';
import { AppService } from '../services/app.service';
import { ResponseHelper } from '../utils/ResponseHelper';
import { ApiResponse } from '../utils/apiResponse';
const appService = new AppService();
export async function getFlowableParamByGrpKey(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("******  getFlowableParamByGrpKey");
    const userInfo: any = req.userInfo;
    const paramResult = await appService.getFlParamByGrpKeyService(userInfo, req.body);
    if (paramResult.code === 20000) {
      await ResponseHelper.send(res, paramResult); return;
    } else {
      await ResponseHelper.send(res, ApiResponse.successNoData([], "Unable to generate data"));
      return;
    }
  } catch (error) {
    // logError("Error api.controller : ", error)
    // // next(error);
    return await ResponseHelper.send(res, ApiResponse.serverError(error + "")); return;
  }
}
export async function getFlowableParamByGrp(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("******  getFlowableParamByGrp");
    const userInfo: any = req.userInfo;
    const paramResult = await appService.getFlParamByGrpService(userInfo, req.body);
    if (paramResult.code === 20000) {
      await ResponseHelper.send(res, paramResult); return;
    } else {
      await ResponseHelper.send(res, ApiResponse.successNoData([], "Unable to generate data"));
      return;
    }
  } catch (error) {
    // logError("Error api.controller : ", error)
    // // next(error);
    return await ResponseHelper.send(res, ApiResponse.serverError(error + "")); return;
  }
}
export async function createFlowableTask(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("******  createFlowableTask");
    const userInfo: any = req.userInfo;
    const paramResult = await appService.createFlTaskService(userInfo, req.body);
    if (paramResult.code === 20000) {
      return await ResponseHelper.send(res, paramResult);
    } else {
      return await ResponseHelper.send(res, ApiResponse.successNoData([], "Unable to generate data"));

    }
  } catch (error) {
    // logError("Error api.controller : ", error)
    // // next(error);
    return await ResponseHelper.send(res, ApiResponse.serverError(error + "")); return;
  }
}
