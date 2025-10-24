import { ParamRepository } from "../repositories/param.repository";
import { ApiResponse } from "../utils/apiResponse";
import { logInfo } from "../utils/logger";

export class SimHubService {
  private paramRepo = new ParamRepository();
  async getParamByKey(payload: any): Promise<any> {
    // paramgroup, paramkey
    const paramResult = await this.paramRepo.findParamByKey(payload);
    if (!paramResult) return ApiResponse.successNoData(paramResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(paramResult, "Records found");
  }
  async getParamByGroup(payload: string): Promise<any[]> {
    return []
  }

  async getSiapUbpTableFields(): Promise<any> {
    const payload = {paramgroup:"SIAPUBP", paramkey:"apiurl"}
     const paramResult = await this.paramRepo.findParamByKey(payload);
    if (!paramResult) return ApiResponse.successNoData(paramResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    try {
        const res = await this.fetchWithNoAuthMethod(paramResult.paramvalue+"/entity/company", {object:"table-fields"}, "OPTIONS", {});
        if (res) {
          // console.log("************** Resp dari get Table Fields ", res);
          const response = res;
          return ApiResponse.success(response.data, "Records found");return;
        } else {
          console.error("Invalid response:", res);
        }
      } catch (error) {
        console.error("Error on batch:", error);
      }
      return ApiResponse.successNoData(paramResult, "Records found");
  }

  async getSiapUbpCompanies(): Promise<any> {
    const payload = {paramgroup:"SIAPUBP", paramkey:"apiurl"}
     const paramResult = await this.paramRepo.findParamByKey(payload);
    if (!paramResult) return ApiResponse.successNoData(paramResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    try {
        const res = await this.fetchWithNoAuthMethod(paramResult.paramvalue+"/entity/company", {partnerReferenceNo:"34343243"}, "GET", {});
        if (res) {
          // console.log("************** Resp dari get data companies ", res);
          const response = res;
          return ApiResponse.success(response.data, "Records found");return;
        } else {
          console.error("Invalid response:", res);
        }
      } catch (error) {
        console.error("Error on batch:", error);
      }
      return ApiResponse.successNoData(paramResult, "Records found");
  }
  async getSiapUbpFormModel(): Promise<any> {
    const payload = {paramgroup:"SIAPUBP", paramkey:"apiurl"}
     const paramResult = await this.paramRepo.findParamByKey(payload);
    if (!paramResult) return ApiResponse.successNoData(paramResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    try {
        const res = await this.fetchWithNoAuthMethod(paramResult.paramvalue+"/entity/company", {object:"model"}, "OPTIONS", {});
        if (res) {
          // console.log("************** Resp dari get Table Fields ", res);
          const response = res;
          return ApiResponse.success(response.data, "Records found");return;
        } else {
          console.error("Invalid response:", res);
        }
      } catch (error) {
        console.error("Error on batch:", error);
      }
      return ApiResponse.successNoData(paramResult, "Records found");
  }

  private async fetchWithNoAuthMethod(path: string, queryParams: any = {},
    method: 'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'DEL' = 'GET',
    bodyData?: any): Promise<any> {
    const searchParams = new URLSearchParams(queryParams);
    const url = `${path}?${searchParams.toString()}`;
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    console.log("***** URL ", url);
    if (method === 'POST' && bodyData) {
      options.body = JSON.stringify(bodyData);
    }
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type") || "";
    // console.log("RESPONS DOWNLOAD ",res);
    console.log("fetchWithAuthMETHOD Content-Type:", contentType);
    let resultYMP;
    if (contentType.includes("application/json")) {
      // console.log("RESPNSE JSON ", res);
      resultYMP = await res.json();
    } else {
      console.log("RESPNSE NO JSON ", res);
      resultYMP = res;
    }
    const result = resultYMP;
    if (result.error === 'invalid_acceess_token') {
      // Refresh token and retry once
      logInfo('✅ Fetching Error :', result)
    }
    return result;
  }
}
