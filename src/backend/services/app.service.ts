import { FlowableRepository } from "../repositories/flowable.repository";
import { ApiResponse } from "../utils/apiResponse";

export class AppService {
  private flowableRepo = new FlowableRepository();
  async getFlParamByGrpKeyService(payload: any, userInfo: any) {
    const paramResult = await this.flowableRepo.flowableParamByGrpKey(payload);
    if (!paramResult) {
      return ApiResponse.successNoData(null, "Unable to retrive data!");
    } else {
      return ApiResponse.success(paramResult, "Success retrive data");
    }
  }
  async getFlParamByGrpService(userInfo: any, payload: any) {
    const paramResult = await this.flowableRepo.flowableParamByGrp(payload);
    if (!paramResult) {
      return ApiResponse.successNoData(null, "Unable to retrive data!");
    } else {
      return ApiResponse.success(paramResult, "Success retrive data");
    }
  }
  async createFlTaskService(userInfo: any, payload: any):Promise<any> {

    try {
      const payloadUrl = { fa_key: "flserverapi", fa_group: "FLOWABLE" }
      const path = await this.flowableRepo.flowableParamByGrpKey(payloadUrl);
      const userpassword = "manage"
      console.log("********* user info************ ", userInfo);
      const url = `${path.fa_value}${payload.urlFlowable}`
      const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${userInfo.username}:${userpassword}`).toString("base64")
      },
      body: JSON.stringify(payload.jsonBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", response.status, errorText);
        return ApiResponse.serverError(errorText);
      }
    const data = await response.json();
    console.log("Process started: ", data);
      return ApiResponse.success(data, "Succes create task")
      // return ApiResponse.successNoData(path, "Unable to retrive data!");
    } catch (error) {
      return ApiResponse.serverError(error+"");
    }
  }
}
