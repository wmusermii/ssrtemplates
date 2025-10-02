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
import { ParamRepository } from "../repositories/param.repository";
import Database from "../database/dbClient";
// import Database from "../database/dbClient";
export class ApiService {
  // private shopeeRepo = new ShopeeRepository();
  private userRepo = new UserRepository();
  // private warehouseRepo = new WarehouseRepository();
  private roleRepo = new RoleRepository();
  private menuRepo = new MenuRepository();
  private groupRepo = new GroupRepository();
  private paramRepo = new ParamRepository()

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

async getTestDatabaseService(config: any):Promise<any> {
  logInfo("DATABASE CONFIG : ", config)
  // {"config":{"client":"pg","condatabase":"ndp_proxy","conhost":"localhost","conport":5432,"conuser":"postgres","conpassword":"postgres","conoption":{}}}
  Database.init({
    client: config.config.client,
    connection: {
      host: config.config.conhost,
      port: config.config.conport,
      user: config.config.conuser,
      password: config.config.conpassword,
      database: config.config.condatabase,
    },
    pool: { min: 2, max: 100 },
  })
  const result = await Database.testConnection();
  if (result.success) {
    await Database.destroy();
    // console.log(result.message);
     return ApiResponse.success(result.success, result.message);
  } else {
    await Database.destroy();
    return ApiResponse.successNoData(result.error, result.message);
  }

  //################## Berhasil Isi #######################
  // return ApiResponse.success({}, "Database connection OK ✅");
}
async goMigratetDatabaseService(config: any):Promise<any> {
  logInfo("DATABASE MIGRATE CONFIG : ", config)
  // {"config":{"client":"pg","condatabase":"ndp_proxy","conhost":"localhost","conport":5432,"conuser":"postgres","conpassword":"postgres","conoption":{}}}
  Database.init({
    client: config.config.client,
    connection: {
      host: config.config.conhost,
      port: config.config.conport,
      user: config.config.conuser,
      password: config.config.conpassword,
      database: config.config.condatabase,
    },
    pool: { min: 2, max: 100 },
  })
  const result = await Database.testConnection();
  if (result.success) {
    const db = Database.get();
    try {
      // Table m_group
    await db.raw(`
        CREATE TABLE IF NOT EXISTS m_group (
          idgroup VARCHAR(50) NOT NULL PRIMARY KEY,
          groupname VARCHAR(100) NOT NULL,
          menublob TEXT DEFAULT '[]',
          description VARCHAR(100),
          created_at TIMESTAMP,
          created_by VARCHAR(100) DEFAULT 'system',
          updated_at TIMESTAMP,
          updated_by VARCHAR(100),
          deleteable INTEGER DEFAULT 1,
          status INTEGER DEFAULT 1
        );
      `);
      // Table m_icons
      await db.raw(`
        CREATE TABLE IF NOT EXISTS m_icons (
          id SERIAL PRIMARY KEY,
          code VARCHAR(1000),
          type VARCHAR(50) DEFAULT 'prime',
          codeother VARCHAR(1000),
          description VARCHAR(200)
        );
      `);

      // Table m_menus
  await db.raw(`
    CREATE TABLE "m_menus" (
  "idMenu" SERIAL PRIMARY KEY,
  "nameMenu" VARCHAR(100) NOT NULL,
  "pathMenu" VARCHAR(1000) DEFAULT '/',
  "idAppMenu" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP,
  "created_by" VARCHAR(100) DEFAULT 'SYSTEM',
  "updated_at" TIMESTAMP,
  "updated_by" VARCHAR(100),
  "iconMenu" VARCHAR(100)
);
  `);

  // Table m_param
  await db.raw(`
    CREATE TABLE IF NOT EXISTS m_param (
      id SERIAL PRIMARY KEY,
      paramgroup VARCHAR(100) DEFAULT '100',
      paramkey VARCHAR(255),
      paramvalue TEXT,
      created_by VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_by VARCHAR(100),
      updated_at TIMESTAMP
    );
  `);

  // Table m_role
  await db.raw(`
    CREATE TABLE IF NOT EXISTS "m_role" (
      "idRole" VARCHAR(10) NOT NULL PRIMARY KEY,
      "roleName" VARCHAR(200) DEFAULT 'undefined',
      "roleDescription" VARCHAR(1000) DEFAULT 'undefined',
      "created_at" TIMESTAMP,
      "deleteable" INTEGER DEFAULT 1
    );
  `);

  // Table m_user
  await db.raw(`
    CREATE TABLE IF NOT EXISTS m_user (
      iduser VARCHAR(50) NOT NULL PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_by VARCHAR(100) DEFAULT 'SYSTEM' NOT NULL,
      created_at TIMESTAMP,
      updated_by VARCHAR(100),
      updated_at TIMESTAMP,
      idgroup VARCHAR(50),
      fullname VARCHAR(200),
      mobile VARCHAR(20) DEFAULT '20',
      email VARCHAR(200),
      is_twofa_enabled INTEGER DEFAULT 0,
      twofa_secret VARCHAR(255),
      deleteable INTEGER DEFAULT 1,
      status INTEGER DEFAULT 1
    );
  `);
    // INSERT DATABASE PERLAHAN
      logInfo("Inserting Users...");
      let allUsers:any[] = await this.userRepo.findAllUserMigrate()
      const cleanUsers = allUsers.map(({ groupname, ...rest }) => rest);// Hapus kolom "groupname" karena tidak ada di struktur m_user
      await db("m_user").insert(cleanUsers);
      logInfo("Inserting Roles...");
      let allRoles = await this.roleRepo.findAllRole();
      await db("m_role").insert(allRoles);
      logInfo("Inserting Params...");
      let allParam:any[] = await this.paramRepo.findParamForMigration();
      await db("m_param").insert(allParam);
      logInfo("Inserting Menus...");
      let allMenus:any[] = await this.menuRepo.findAllMenuMigrate();
      await db("m_menus").insert(allMenus);
      logInfo("Inserting Icons...");
      let allIcons:any[] = await this.menuRepo.findAllIconsPrimeMigrate();
      await db("m_icons").insert(allIcons);
      logInfo("Inserting Groups...");
      let allGroups:any[] = await this.groupRepo.findAllGroupMigrate();
      await db("m_group").insert(allGroups);
      console.log("✅ Tables created successfully");
      await Database.destroy();
      return ApiResponse.success(true, "✅ Tables created successfully");
    } catch (error) {

       return ApiResponse.successNoData(false, "✅ Unable to create tables");
    }

    // console.log(result.message);

  } else {
    await Database.destroy();
    return ApiResponse.successNoData(result.error, result.message);
  }

  //################## Berhasil Isi #######################
  // return ApiResponse.success({}, "Database connection OK ✅");
}

  async getParamsByGroupService(userinfo: any, payload:any) {
    const paramResult = await this.paramRepo.findParamByGroup(payload);
    if (!paramResult) return ApiResponse.successNoData(paramResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(paramResult, "Records found");
  }
  async getParamsByKeyService(userinfo: any, payload:any) {
    const paramResult = await this.paramRepo.findParamByKey(payload);
    if (!paramResult) return ApiResponse.successNoData(paramResult, "Unable to get data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(paramResult, "Records found");
  }
  async updParamsByGroupService(userinfo: any, payload:any) {
    // const paramResult = await this.paramRepo.findParamByGroup(payload);
    const paramgroup = payload.paramgroup;
    const results:any[]= [];

    for (const [key, value] of Object.entries(payload)) {
      const updateScript:any = {paramkey:key, paramvalue:value+""}
      const updateRecords = await this.paramRepo.updParamByKey(updateScript);
      results.push(updateRecords);
    }

    if (results.length < 1) return ApiResponse.successNoData(results, "Unable to update data!");
    //################## Berhasil Isi #######################
    return ApiResponse.success(results, "Records found");
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




//############################################ HELPER UTIL###############################################################
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

