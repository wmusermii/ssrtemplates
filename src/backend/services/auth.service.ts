import { GroupRepository } from '../repositories/group.repository';
import { UserRepository } from '../repositories/user.repository';
import { ApiResponse } from '../utils/apiResponse';

export class AuthService {
    private repository = new UserRepository();
    private groupRepository = new GroupRepository();
    async login(username: string, password: string) {
        // const user = await this.repository.findByUsername(username);
        const user = await this.repository.findByUsernamePassword(username, password);
        if (!user) return ApiResponse.successNoData(user, 'Incorrect Username and Password!');
        return ApiResponse.success(user, 'Records found');
    }
    async selectGetUserByUserID(username: string) {
        const user = await this.repository.findByUsername(username);
        if (!user) return ApiResponse.successNoData(user, 'Incorrect Username and Password!');
        return ApiResponse.success(user, 'Records found');
    }
    async getUniqueUser(username: string, mobile: string, email: string) {
        const user = await this.repository.findByUniqueUser(username, mobile, email);
        if (!user) return ApiResponse.successNoData(user, 'Incorrect Username and Password!');
        return ApiResponse.success(user, 'Records found');
    }
    async selectAclAttrb(userinfo: any, payload: any) {
        const groupObj = await this.groupRepository.findAllGroupById(userinfo.idgroup);
        if (!groupObj) {
            return ApiResponse.successNoData(groupObj, 'Incorrect Group Attribute!');
        }
        if (groupObj.menublob) {
            let menublobObj: any[] = [];
            try {
                menublobObj = JSON.parse(groupObj.menublob);
            } catch (e) {
                return ApiResponse.successNoData([], 'Invalid menublob format!');
            }
            const resultObj = await this.findMenuByRoute(menublobObj, payload.routeUrl);
            // console.log("RESPONSE FIND MENU ", resultObj);
            if (!resultObj) {
                return ApiResponse.successNoData(resultObj, 'Incorrect Group Attribute!');
            }
            return ApiResponse.success(resultObj, 'Records found');
        }

        // fallback default kalau tidak ada menublob
        return ApiResponse.successNoData([], 'Incorrect Group Attribute!');
    }

    async findMenuByRoute(data: any[], routeUrl: string): Promise<any | null> {
        const search = async (items: any[]): Promise<any | null> => {
            for (const item of items) {
                if (item.routerLink === routeUrl) {
                    return item;
                }
                if (item.items && Array.isArray(item.items)) {
                    const found = await search(item.items);
                    if (found) return found;
                }
            }
            return null;
        };

        return await search(data);
    }
}
