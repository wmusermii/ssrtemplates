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
      // console.log("********* user info************ ", userInfo);
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
    // console.log("Process started: ", data);
      return ApiResponse.success(data, "Succes create task")
      // return ApiResponse.successNoData(path, "Unable to retrive data!");
    } catch (error) {
      return ApiResponse.serverError(error+"");
    }
  }
  async getFlTaskService(userInfo: any, payload: any):Promise<any> {

    try {
      const payloadUrl = { fa_key: "flserverapi", fa_group: "FLOWABLE" }
      const path = await this.flowableRepo.flowableParamByGrpKey(payloadUrl);
      const userpassword = "manage"
      // console.log("********* user info get task task************ ", userInfo);
      const url = `${path.fa_value}${payload.urlFlowable}`
      console.log("URL Get Task ", url);
      const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${userInfo.username}:${userpassword}`).toString("base64")
      }
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", response.status, errorText);
        return ApiResponse.serverError(errorText);
      }
    const data = await response.json();
    // console.log("Process started: ", data);
      return ApiResponse.success(data, "Succes create task")
      // return ApiResponse.successNoData(path, "Unable to retrive data!");
    } catch (error) {
      return ApiResponse.serverError(error+"");
    }
  }
  async actionFlTaskService(userInfo: any, payload: any):Promise<any> {
    try {
      const payloadUrl = { fa_key: "flserverapi", fa_group: "FLOWABLE" }
      const path = await this.flowableRepo.flowableParamByGrpKey(payloadUrl);
      const userpassword = "manage"
      // console.log("********* user info get task task************ ", userInfo);
      // const url = `${path.fa_value}${payload.urlFlowable}`
      //******* Claim dulu */
      console.log("PAYLOAD ", );
      const url = `${path.fa_value}${payload.urlFlowable}${payload.taskId}`
      let payloadClaim = {"action":"claim", "assignee":userInfo.username}
      console.log("**** url claim ", url);
      const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${userInfo.username}:${userpassword}`).toString("base64")
      },
      body:JSON.stringify(payloadClaim)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", response.status, errorText);
        return ApiResponse.serverError(errorText);
      }
      console.log("**** SETELAH CLAIM ", response);
      if(response.ok) {
          console.log("**** URL ACTION ", url);
          // console.log("payload action ",payload.data);
          const responseAction =await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + Buffer.from(`${userInfo.username}:${userpassword}`).toString("base64")
          },
          body:JSON.stringify(payload.data)
          });
          console.log("Hasil Action task ", responseAction);
          if(!responseAction.ok) {
              const errorText = await responseAction.text();
              console.error("Error:", responseAction.status, errorText);
              return ApiResponse.serverError(errorText);
          }
          const data = responseAction;
          return ApiResponse.success(data.ok, "Succes action task")
      }


    // const data = await response.json();
    // console.log("Process started: ", data);
      return ApiResponse.successNoData({}, "Succes create task")
      // return ApiResponse.successNoData(path, "Unable to retrive data!");
    } catch (error) {
      return ApiResponse.serverError(error+"");
    }
  }
  async claimFlTaskService(userInfo: any, payload: any):Promise<any> {
    try {
      const payloadUrl = { fa_key: "flserverapi", fa_group: "FLOWABLE" }
      const path = await this.flowableRepo.flowableParamByGrpKey(payloadUrl);
      const userpassword = "manage"
      // console.log("********* user info get task task************ ", userInfo);
      // console.log("*** claim payload : ", payload);
      const url = `${payload.url}`
      let payloadClaim = {"action":"claim", "assignee":userInfo.username}
      const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${userInfo.username}:${userpassword}`).toString("base64")
      },
      body:JSON.stringify(payloadClaim)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", response.status, errorText);
        return ApiResponse.serverError(errorText);
      }
    const data = await response.json();
    console.log("*** Process claim task : ", data);
      if(data) {
          return ApiResponse.success(data, "Succes claim")
      } else {
        return ApiResponse.successNoData({}, "Succes no data")
      }



      // return ApiResponse.successNoData(path, "Unable to retrive data!");
    } catch (error) {
      return ApiResponse.serverError(error+"");
    }
  }
  async getFormFlTaskService(userInfo: any, payload: any):Promise<any> {
    try {
      const payloadUrl = { fa_key: "flserverapi", fa_group: "FLOWABLE" }
      const path = await this.flowableRepo.flowableParamByGrpKey(payloadUrl);
      const userpassword = "manage"
      // console.log("********* user info get task task************ ", userInfo);
      const url = `${path.fa_value}${payload.urlFlowable}`
      // console.log("*** URL *** ", url);
      const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${userInfo.username}:${userpassword}`).toString("base64")
      }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", response.status, errorText);
        return ApiResponse.serverError(errorText);
      }
    const data = await response.json();
    // console.log("Process Form started: ", data);
      if(data.data.length > 0) {
        console.log("*** AMBIL data Model");
        const urlModel = `${path.fa_value}/flowable-task/form-api/form-repository/form-definitions/${data.data[0].id}/model`
        const responseModel = await fetch(urlModel, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + Buffer.from(`${userInfo.username}:${userpassword}`).toString("base64")
          }
          });
          if (!responseModel.ok) {
              const errorText = await responseModel.text();
              console.error("Error:", responseModel.status, errorText);
              return ApiResponse.serverError(errorText);
          }
          const dataModel = await responseModel.json()
          // console.log("Process Data Model : ", dataModel);
          return ApiResponse.success(dataModel, "Succes get form")
      } else {
        return ApiResponse.successNoData({}, "Succes no data")
      }



      // return ApiResponse.successNoData(path, "Unable to retrive data!");
    } catch (error) {
      return ApiResponse.serverError(error+"");
    }
  }
}
