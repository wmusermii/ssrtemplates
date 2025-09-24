import { UserRepository } from "../repositories/user.repository";
import { ApiResponse } from "../utils/apiResponse";
import { logInfo } from "../utils/logger";

import nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
// import { WarehouseRepository } from "../repositories/warehouse.repository";

import { Request } from "express";
import { RoleRepository } from "../repositories/role.repository";
import { MenuRepository } from "../repositories/menu.repository";
import { GroupRepository } from "../repositories/group.repository";
export class ApiService {
  // private shopeeRepo = new ShopeeRepository();
  private userRepo = new UserRepository();
  // private warehouseRepo = new WarehouseRepository();
  private roleRepo = new RoleRepository();
  private menuRepo = new MenuRepository();
  private groupRepo = new GroupRepository();


  // async sendEmailNotification(to: string, subject: string, message: string) {
  //   // console.log('sendEmailNotification called with:', { to, subject, message });
  //   const smtpVariable = await this.shopeeRepo.getSMTPVariables();
  //   logInfo("SMTP OBJECT ", smtpVariable);
  //   // {"smtp":"smtp.gmail.com","usermail":"aryaadityawijaya@gmail.com","password":"vyenzhnzitzlqbbb","service":"gmail","secret":"https://myaccount.google.com/apppasswords","refreshtoken":"https://myaccount.google.com/apppasswords","accesstoken":"https://myaccount.google.com/apppasswords","port":465}
  //   const transporter = nodemailer.createTransport({
  //     service: smtpVariable.service,
  //     auth: {
  //       user: smtpVariable.usermail,        // Ganti dengan email Gmail kamu
  //       pass: smtpVariable.password,           // Ganti dengan App Password Gmail (16 karakter)
  //     },
  //   });
  //   const mailOptions = {
  //     from: `"Jawara Pattimura" <${smtpVariable.usermail}>`, // Ganti sesuai branding dan email kamu
  //     to: to,
  //     subject: subject,
  //     html: message,
  //   };

  //   try {
  //     const info = await transporter.sendMail(mailOptions);
  //     logInfo("📤 Email terkirim: ", info.messageId);
  //     return ApiResponse.success({ messageId: info.messageId }, "Email sent successfully");
  //   } catch (error) {
  //     logInfo("❌ Gagal kirim email:", error);
  //     return ApiResponse.successNoData({}, "Failed to send email");
  //   }
  // }
  async registerUser(payload: any) {
    const userResult = await this.userRepo.registerUser(payload);
    if (!userResult) {
      return ApiResponse.successNoData(null, "Unable to insert data!");
    } else {
      return ApiResponse.success(userResult, "Success insert");
    }
  }
  async updateUser(payload: any, userInfo: any) {
    const userResult = await this.userRepo.updateUser(payload, userInfo);
    if (!userResult) {
      return ApiResponse.successNoData(null, "Unable to update data!");
    } else {
      return ApiResponse.success(userResult, "Success update");
    }
  }
  async getRolesService(userinfo: any) {
    const roleResult = await this.roleRepo.findAllRole();
    if (!roleResult) return ApiResponse.successNoData(roleResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(roleResult, "Records found");
  }
  async getRoleByIdService(userinfo: any, payload:any) {
    const roleResult = await this.roleRepo.findAllRoleById(payload.idRole);
    if (!roleResult) return ApiResponse.successNoData(roleResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(roleResult, "Records found");
  }
  async addRoleService(userinfo: any, payload:any) {

    payload = {...payload, ...{created_at:new Date().toISOString().slice(0, 19).replace('T', ' ')}}


    const roleResult = await this.roleRepo.addRole(payload);
    if (!roleResult) return ApiResponse.successNoData(roleResult, "Unable to add data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(roleResult, "Record added");
  }
  async updRoleService(userinfo: any, payload:any) {
    const idRoleOld = payload.idRoleOld;
    delete payload.idRoleOld;
    const roleResult = await this.roleRepo.updRole(payload,idRoleOld);
    if (!roleResult) return ApiResponse.successNoData(roleResult, "Unable to update data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(roleResult, "Record updated");
  }
  async dellRoleService(userinfo: any, payload:any) {
    const roleResult = await this.roleRepo.delRole(payload);
    if (!roleResult) return ApiResponse.successNoData(roleResult, "Unable to delete data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(roleResult, "Record deleted");
  }
  async getIconService(userinfo: any) {
    const iconResult = await this.menuRepo.findAllIconsPrime();
    if (!iconResult) return ApiResponse.successNoData(iconResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(iconResult, "Records found");
  }
  async getMenusService(userinfo: any) {
    const menuResult = await this.menuRepo.findAllMenu();
    if (!menuResult) return ApiResponse.successNoData(menuResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(menuResult, "Records found");
  }
  async getMenuByIdService(userinfo: any, payload:any) {
    const menuResult = await this.menuRepo.findAllMenuById(payload.idRole);
    if (!menuResult) return ApiResponse.successNoData(menuResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(menuResult, "Records found");
  }
  async addMenuService(userinfo: any, payload:any) {
    payload = {...payload, ...{created_at:new Date().toLocaleString('sv-SE').replace('T', ' ')},...{created_by:userinfo.iduser}}
    const menuResult = await this.menuRepo.addMenu(payload);
    if (!menuResult) return ApiResponse.successNoData(menuResult, "Unable to add data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(menuResult, "Record added");
  }
  async updMenuService(userinfo: any, payload:any) {
    payload = {...payload, ...{updated_at:new Date().toLocaleString('sv-SE').replace('T', ' ')},...{updated_by:userinfo.iduser}}
    const menuResult = await this.menuRepo.updMenu(payload);
    if (!menuResult) return ApiResponse.successNoData(menuResult, "Unable to update data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(menuResult, "Record updated");
  }
  async dellMenuService(userinfo: any, payload:any) {
    const menuResult = await this.menuRepo.delMenu(payload);
    if (!menuResult) return ApiResponse.successNoData(menuResult, "Unable to delete data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(menuResult, "Record deleted");
  }

  async getGroupsService(userinfo: any) {
    const groupResult = await this.groupRepo.findAllGroup();
    if (!groupResult) return ApiResponse.successNoData(groupResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(groupResult, "Records found");
  }
  async getGroupByIdService(userinfo: any, payload:any) {
    const groupResult = await this.groupRepo.findAllGroupById(payload.idRole);
    if (!groupResult) return ApiResponse.successNoData(groupResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(groupResult, "Records found");
  }
  async addGroupService(userinfo: any, payload:any) {
    payload = {...payload, ...{created_at:new Date().toLocaleString('sv-SE').replace('T', ' ')},...{created_by:userinfo.iduser}}
    const groupResult = await this.groupRepo.addGroup(payload);
    if (!groupResult) return ApiResponse.successNoData(groupResult, "Unable to add data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(groupResult, "Record added");
  }
  async updGroupService(userinfo: any, payload:any) {
    payload = {...payload, ...{updated_at:new Date().toLocaleString('sv-SE').replace('T', ' ')},...{updated_by:userinfo.iduser}}
    const groupResult = await this.groupRepo.updGroup(payload);
    if (!groupResult) return ApiResponse.successNoData(groupResult, "Unable to update data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(groupResult, "Record updated");
  }
  async updGroupMenuService(userinfo: any, payload:any) {
    payload = {...payload, ...{updated_at:new Date().toLocaleString('sv-SE').replace('T', ' ')},...{updated_by:userinfo.iduser}}
    const groupResult = await this.groupRepo.updGroupMenu(payload);
    if (!groupResult) return ApiResponse.successNoData(groupResult, "Unable to update data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(groupResult, "Record updated");
  }
  async dellGroupService(userinfo: any, payload:any) {
    console.log("DELETE PAYLOAD ", payload);
    const groupResult = await this.groupRepo.delGroup(payload);
    if (!groupResult) return ApiResponse.successNoData(groupResult, "Unable to delete data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(groupResult, "Record deleted");
  }

  async getUsersService(userinfo: any) {
    const userResult = await this.userRepo.findAllUsers(userinfo);
    if (!userResult) return ApiResponse.successNoData(userResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(userResult, "Records found");
  }
  async getUserByIdService(userinfo: any, payload:any) {
    const userResult = await this.userRepo.findAllUsersById(userinfo,payload);
    if (!userResult) return ApiResponse.successNoData(userResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(userResult, "Records found");
  }
  async addUserService(userinfo: any, payload:any) {
    const iduserGenerated = await this.generateRandomId()
    payload.status = payload.status?1:0;

    payload = {...payload,...{iduser:iduserGenerated}, ...{created_at:new Date().toLocaleString('sv-SE').replace('T', ' ')},...{created_by:userinfo.iduser}}
    const userResult = await this.userRepo.addUser(payload);
    if (!userResult) return ApiResponse.successNoData(userResult, "Unable to add data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(userResult, "Record added");
  }
  async updUserService(userinfo: any, payload:any) {

    payload.status = payload.status?1:0;
    payload = {...payload, ...{updated_at:new Date().toLocaleString('sv-SE').replace('T', ' ')},...{updated_by:userinfo.iduser}}
    const userResult = await this.userRepo.updUser(payload);
    if (!userResult) return ApiResponse.successNoData(userResult, "Unable to update data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(userResult, "Record updated");
  }
  async dellUserService(userinfo: any, payload:any) {
    const userResult = await this.userRepo.delUser(payload);
    if (!userResult) return ApiResponse.successNoData(userResult, "Unable to delete data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(userResult, "Record deleted");
  }





  private toDatetimeString(unix: number): string {
    const date = new Date(unix * 1000);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
  private async generateRandomId(length: number = 9): Promise<string> {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const id = Math.floor(Math.random() * (max - min + 1) + min).toString();
    return id;
  }
}

