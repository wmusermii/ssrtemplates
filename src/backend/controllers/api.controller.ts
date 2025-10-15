
import { NextFunction, Request, Response } from 'express';
import { ApiService } from '../services/api.service';
import { ResponseHelper } from '../utils/ResponseHelper';
import { ApiResponse } from '../utils/apiResponse';
import { logError } from '../utils/logger';
const apiService = new ApiService();
export function echo(req: Request, res: Response, next: NextFunction) {
    try {
        const payload = { code: 1, message: 'Echo test workeds from controller' };
        ResponseHelper.send(res, ApiResponse.success(payload, 'Echoing!'));
    } catch (error) {
        logError('Error api.controller : ', error);
        next(error);
        // ResponseHelper.send(res,ApiResponse.serverError(error+""));
    }
}
//##################### PROCESS SHOPEE ######################
export async function updateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { iduser, username, fullname, mobile, email, groupname, changepassword, password, cpassword } = req.body;
        const userInfo: any = req.userInfo;
        const payload = {
            iduser: iduser,
            username: username,
            fullname: fullname,
            mobile: mobile,
            email: email,
            groupname: groupname,
            password: password,
            changepassword: changepassword,
        };
        console.log('####################################### updateUser ', payload);
        const updateResult = await apiService.updateUser(payload, userInfo);
        console.log('####################################### updateUser ', updateResult);
        if (updateResult.code === 20000) {
            await ResponseHelper.send(res, updateResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        // next(error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}
//##################### PROCESS ELSE ######################

export async function getParamsByGroup(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### getParamsByGroup');
        const userInfo: any = req.userInfo;
        const paramResult = await apiService.getParamsByGroupService(userInfo, req.body);
        if (paramResult.code === 20000 && paramResult.data.length > 0) {
            await ResponseHelper.send(res, paramResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        // next(error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}
export async function updParamsByGroup(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### updParamsByGroup');
        const userInfo: any = req.userInfo;
        const paramResult = await apiService.updParamsByGroupService(userInfo, req.body);
        if (paramResult.code === 20000) {
            await ResponseHelper.send(res, paramResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        // next(error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}
export async function getParamsByKey(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### getParamsByKey');
        const userInfo: any = req.userInfo;
        const paramResult = await apiService.getParamsByKeyService(userInfo, req.body);
        if (paramResult.code === 20000) {
            await ResponseHelper.send(res, paramResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        // next(error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}

export async function getTestDatabase(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### getTestDatabase');
        const userInfo: any = req.userInfo;
        const paramResult = await apiService.getTestDatabaseService(req.body);
        if (paramResult.code === 20000) {
            await ResponseHelper.send(res, paramResult);
            return;
        } else {
            await ResponseHelper.send(res, paramResult);
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        // next(error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}
export async function goMigrateDatabase(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### goMigrateDatabase');
        const userInfo: any = req.userInfo;
        const paramResult = await apiService.goMigratetDatabaseService(req.body);
        if (paramResult.code === 20000) {
            await ResponseHelper.send(res, paramResult);
            return;
        } else {
            await ResponseHelper.send(res, paramResult);
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        // next(error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}

export async function getRolesAvailable(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### getRolesAvailable');
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.getRolesService(userInfo);
        if (packageResult.code === 20000 && packageResult.data.length > 0) {
            await ResponseHelper.send(res, packageResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        // next(error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}
export async function addRoles(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### addRoles');
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.addRoleService(userInfo, req.body);
        if (packageResult.code === 20000) {
            await ResponseHelper.send(res, packageResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}
export async function updRoles(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### updRoles');
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.updRoleService(userInfo, req.body);
        if (packageResult.code === 20000) {
            await ResponseHelper.send(res, packageResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}
export async function delRoles(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### delRoles');
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.dellRoleService(userInfo, req.body);
        if (packageResult.code === 20000) {
            await ResponseHelper.send(res, packageResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}

export async function getIcons(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### getIcons');
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.getIconService(userInfo);
        if (packageResult.code === 20000 && packageResult.data.length > 0) {
            await ResponseHelper.send(res, packageResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        // next(error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}
export async function getMenusAvailable(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### getMenusAvailable');
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.getMenusService(userInfo);
        if (packageResult.code === 20000 && packageResult.data.length > 0) {
            await ResponseHelper.send(res, packageResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        // next(error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}
export async function addMenus(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### addMenus');
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.addMenuService(userInfo, req.body);
        if (packageResult.code === 20000) {
            await ResponseHelper.send(res, packageResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}
export async function updMenus(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### updMenus');
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.updMenuService(userInfo, req.body);
        if (packageResult.code === 20000) {
            await ResponseHelper.send(res, packageResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}
export async function delMenus(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### delMenus');
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.dellMenuService(userInfo, req.body);
        if (packageResult.code === 20000) {
            await ResponseHelper.send(res, packageResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}

export async function getGroupsAvailable(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### getGroupsAvailable');
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.getGroupsService(userInfo);
        if (packageResult.code === 20000 && packageResult.data.length > 0) {
            await ResponseHelper.send(res, packageResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        // next(error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}
export async function addGroups(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### addGroups');
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.addGroupService(userInfo, req.body);
        if (packageResult.code === 20000) {
            await ResponseHelper.send(res, packageResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}
export async function updGroups(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### updGroups');
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.updGroupService(userInfo, req.body);
        if (packageResult.code === 20000) {
            await ResponseHelper.send(res, packageResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}
export async function updGroupMenu(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### updGroupMenu');
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.updGroupMenuService(userInfo, req.body);
        if (packageResult.code === 20000) {
            await ResponseHelper.send(res, packageResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}
export async function delGroups(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### delGroups');
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.dellGroupService(userInfo, req.body);
        if (packageResult.code === 20000) {
            await ResponseHelper.send(res, packageResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}

export async function getUsersAvailable(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### getUsersAvailable');
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.getUsersService(userInfo);
        if (packageResult.code === 20000 && packageResult.data.length > 0) {
            await ResponseHelper.send(res, packageResult);
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        // next(error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}
export async function addUsers(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('####################################### addUsers');
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.addUserService(userInfo, req.body);
        if (packageResult.code === 20000) {
            return await ResponseHelper.send(res, packageResult);
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to generate data'));
            return;
        }
    } catch (error) {
        logError('Error api.controller : ', error);
        return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
    }
}
export async function updUsers(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("####################################### updUsers");
    const userInfo: any = req.userInfo;
    const packageResult = await apiService.updUserService(userInfo,req.body);
    if (packageResult.code === 20000) {
      await ResponseHelper.send(res, packageResult); return;
    } else {
      await ResponseHelper.send(res, ApiResponse.successNoData([], "Unable to generate data"));
      return;
    }
  } catch (error) {
      logError('Error api.controller : ', error);
      return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
  }
}
export async function delUsers(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("####################################### delUsers");
    const userInfo: any = req.userInfo;
    const packageResult = await apiService.dellUserService(userInfo,req.body);
    if (packageResult.code === 20000) {
      await ResponseHelper.send(res, packageResult); return;
    } else {
      await ResponseHelper.send(res, ApiResponse.successNoData([], "Unable to generate data"));
      return;
    }
  } catch (error) {
      logError('Error api.controller : ', error);
      return await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
  }
}
