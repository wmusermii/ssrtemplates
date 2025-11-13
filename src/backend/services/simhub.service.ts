import { log } from "node:console";
import { ParamRepository } from "../repositories/param.repository";
import { ApiResponse } from "../utils/apiResponse";
import { logInfo } from "../utils/logger";
import { BussinesFlowRepository } from "../repositories/siapbifast/bussinesflow.repository";

export class SimHubService {
  private paramRepo = new ParamRepository();
  private bussinesFlowRepo = new BussinesFlowRepository();
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
    const payload = { paramgroup: "SIAPUBP", paramkey: "apiurl" }
    const paramResult = await this.paramRepo.findParamByKey(payload);
    if (!paramResult) return ApiResponse.successNoData(paramResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    try {
      const res = await this.fetchWithNoAuthMethod(paramResult.paramvalue + "/entity/company", { object: "table-fields" }, "OPTIONS", {});
      if (res) {
        // console.log("************** Resp dari get Table Fields ", res);
        const response = res;
        return ApiResponse.success(response.data, "Records found"); return;
      } else {
        console.error("Invalid response:", res);
      }
    } catch (error) {
      console.error("Error on batch:", error);
    }
    return ApiResponse.successNoData(paramResult, "Records found");
  }
  async getSiapUbpCompanies(): Promise<any> {
    const payload = { paramgroup: "SIAPUBP", paramkey: "apiurl" }
    const paramResult = await this.paramRepo.findParamByKey(payload);
    if (!paramResult) return ApiResponse.successNoData(paramResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    try {
      const res = await this.fetchWithNoAuthMethod(paramResult.paramvalue + "/entity/company", { partnerReferenceNo: "34343243" }, "GET", {});
      if (res) {
        // console.log("************** Resp dari get data companies ", res);
        const response = res;
        return ApiResponse.success(response.data, "Records found"); return;
      } else {
        console.error("Invalid response:", res);
      }
    } catch (error) {
      console.error("Error on batch:", error);
    }
    return ApiResponse.successNoData(paramResult, "Records found");
  }
  async postSiapUbpCompany(dataPayload: any): Promise<any> {
    const payload = { paramgroup: "SIAPUBP", paramkey: "apiurl" }
    const paramResult = await this.paramRepo.findParamByKey(payload);
    if (!paramResult) return ApiResponse.successNoData(paramResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    try {
      const res = await this.fetchWithNoAuthMethod(paramResult.paramvalue + "/entity/company", {}, "POST", dataPayload);
      if (res) {
        console.log("************** Resp post data companies ", res);
        const response = res;
        return ApiResponse.success(response, "Records found"); return;
      } else {
        console.error("Invalid response:", res);
      }
    } catch (error) {
      console.error("Error on batch:", error);
    }
    return ApiResponse.successNoData(paramResult, "Records found");
  }
  async updSiapUbpCompany(dataPayload: any): Promise<any> {
    const payload = { paramgroup: "SIAPUBP", paramkey: "apiurl" }
    const paramResult = await this.paramRepo.findParamByKey(payload);
    if (!paramResult) return ApiResponse.successNoData(paramResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    try {
      const res = await this.fetchWithNoAuthMethod(paramResult.paramvalue + "/entity/company", {}, "PUT", dataPayload);
      if (res) {
        console.log("************** Resp update data companies ", res);
        const response = res;
        return ApiResponse.success(response, "Records found"); return;
      } else {
        console.error("Invalid response:", res);
      }
    } catch (error) {
      console.error("Error on batch:", error);
    }
    return ApiResponse.successNoData(paramResult, "Records found");
  }
  async delSiapUbpCompany(dataPayload: any): Promise<any> {
    const payload = { paramgroup: "SIAPUBP", paramkey: "apiurl" }
    const paramResult = await this.paramRepo.findParamByKey(payload);
    if (!paramResult) return ApiResponse.successNoData(paramResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    try {

      const res = await this.fetchWithNoAuthMethod(paramResult.paramvalue + "/entity/company", {}, "DELETE", dataPayload);
      if (res) {
        console.log("************** Resp delet data companies ", res);
        const response = res;
        return ApiResponse.success(response, "Records found"); return;
      } else {
        console.error("Invalid response:", res);
      }
    } catch (error) {
      console.error("Error on batch:", error);
    }
    return ApiResponse.successNoData(paramResult, "Records found");
  }
  async getSiapUbpFormModel(): Promise<any> {
    const payload = { paramgroup: "SIAPUBP", paramkey: "apiurl" }
    const paramResult = await this.paramRepo.findParamByKey(payload);
    if (!paramResult) return ApiResponse.successNoData(paramResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    try {
      const res = await this.fetchWithNoAuthMethod(paramResult.paramvalue + "/entity/company", { object: "model" }, "OPTIONS", {});
      if (res) {
        // console.log("************** Resp dari get Table Fields ", res);
        const response = res;
        return ApiResponse.success(response.data, "Records found"); return;
      } else {
        console.error("Invalid response:", res);
      }
    } catch (error) {
      console.error("Error on batch:", error);
    }
    return ApiResponse.successNoData(paramResult, "Records found");
  }
//################################################# FOR BI FAST ###################################################

  async getSiapBiFastBussinesList(): Promise<any> {
   // paramgroup, paramkey
    const bfesult = await this.bussinesFlowRepo.findAllBussinesList();
    if (!bfesult) return ApiResponse.successNoData(bfesult, "Unable to get data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(bfesult, "Records found");
  }
  async getSiapBiFastBussinesById(dataPayload: any): Promise<any> {
   // paramgroup, paramkey
    const bfesult = await this.bussinesFlowRepo.findBussinesListById(dataPayload);
    if (!bfesult) return ApiResponse.successNoData(bfesult, "Unable to get data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(bfesult, "Records found");
  }
async postSiapBiFastBussinesList(userinfo: any,dataPayload: any): Promise<any> {
    dataPayload = {...dataPayload, ...{created_at:new Date().toLocaleString('sv-SE').replace('T', ' ')},...{created_by:userinfo.iduser}}
    const bfesult = await this.bussinesFlowRepo.addBussinesList(dataPayload);
    if (!bfesult) return ApiResponse.successNoData(bfesult, "Unable to add data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(bfesult, "Record added");
  }
  async updSiapBiFastBussinesList(userinfo: any,dataPayload: any): Promise<any> {
    dataPayload = {...dataPayload, ...{created_at:new Date().toLocaleString('sv-SE').replace('T', ' ')},...{created_by:userinfo.iduser}}
    const bfesult = await this.bussinesFlowRepo.updBussinesList(dataPayload);
    if (!bfesult) return ApiResponse.successNoData(bfesult, "Unable to add data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(bfesult, "Record added");
  }
  async delSiapBiFastBussinesList(userinfo: any,dataPayload: any): Promise<any> {
    dataPayload = {...dataPayload, ...{created_at:new Date().toLocaleString('sv-SE').replace('T', ' ')},...{created_by:userinfo.iduser}}
    const bfesult = await this.bussinesFlowRepo.updBussinesList(dataPayload);
    if (!bfesult) return ApiResponse.successNoData(bfesult, "Unable to add data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(bfesult, "Record added");
  }








  private async fetchWithNoAuthMethod(
    path: string,
    queryParams: Record<string, string | number | boolean> = {},
    method: 'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'DELETE' = 'GET',
    bodyData?: any
  ): Promise<any> {

    // Build query string
    const searchParams = new URLSearchParams(queryParams as any).toString();
    const url = searchParams ? `${path}?${searchParams}` : path;

    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    // Tambahkan Body untuk method selain GET & OPTIONS
    const methodAllowBody = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (methodAllowBody.includes(method) && bodyData) {
      options.body = JSON.stringify(bodyData);
    }

    console.log("***** URL:", url);
    console.log("Method:", method);
    if (bodyData) console.log("Body:", bodyData);

    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type") || "";

    console.log("fetchWithNoAuthMethod Content-Type:", contentType);

    let result: any;

    if (contentType.includes("application/json")) {
      result = await res.json();
    } else {
      console.log("Response Non-JSON", res);
      result = res;
    }

    // Example error handling
    if (result?.error === 'invalid_access_token') {
      console.warn('⚠️ Invalid access token — consider refresh token flow');
    }

    return result;
  }

}
