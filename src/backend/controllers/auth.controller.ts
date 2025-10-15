import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { ResponseHelper } from '../utils/ResponseHelper';
import { ApiResponse } from '../utils/apiResponse';
import { EncryptDecryptJwt } from '../utils/encryptdecryptJwt';
import { logError, logInfo } from '../utils/logger';

const authService = new AuthService();
const apiService = new ApiService();

export async function login(req: Request, res: Response) {
    const { credential } = req.body;
    try {
        const decoded = Buffer.from(credential, 'base64').toString('utf-8');
        const [username, password] = decoded.split(':');
        const user = await authService.selectGetUserByUserID(username);
        if (!user) {
            return await ResponseHelper.send(res, ApiResponse.notFound('Invalid username or password'));
        }
        logInfo('data query result user', user);
        const isMatchPassword = await bcrypt.compare(password, user.data.password);
        if (!isMatchPassword) {
            return await ResponseHelper.send(res, ApiResponse.notFound('Invalid username or password'));
        }
        let dataTemp: any = user.data;
        const data: any = {
            ...dataTemp,
            ua: req.headers['user-agent'],
            ip: req.ip,
        };
        let tokenCookie = null;
        if (user.code === 20000) {
            const token = await EncryptDecryptJwt.generateToken(data);
            delete data.password;
            tokenCookie = await EncryptDecryptJwt.generateToken(data);
            const uInfo = JSON.parse(JSON.stringify(data)); // agar data tidak hilang
            for (const key in user.data) {
                if (user.data.hasOwnProperty(key)) {
                    delete user.data[key];
                }
            }
            // logInfo("############################UINFO 2 : ",uInfo)
            delete uInfo.menublob;
            user.data.token = token;
            user.data.userinfo = uInfo;
            const optionCookie: any[] = [
                {
                    name: 'x_token',
                    value: tokenCookie,
                    options: {
                        httpOnly: true, // Melindungi dari akses JavaScript
                        secure: false, // Hanya dikirim melalui HTTPS jika true
                        signed: true,
                        sameSite: 'strict', // Mencegah CSRF
                        maxAge: convertToMaxAge('15m'), // Cookie berlaku selama 15 menit
                    },
                },
            ];
            await ResponseHelper.sendWithCookies(res, user, optionCookie);
            return;
        } else {
            await ResponseHelper.send(res, user);
            return;
        }
    } catch (error) {
        logError('Error auth.controller : ', error);
        await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
        return;
    }
}
export async function logout(req: Request, res: Response) {
    try {
        const optionCookie: any[] = [
            {
                name: 'x_token',
                value: null,
                options: {
                    httpOnly: true, // Melindungi dari akses JavaScript
                    secure: false, // Hanya dikirim melalui HTTPS jika true
                    signed: true,
                    sameSite: 'strict', // Mencegah CSRF
                    maxAge: convertToMaxAge('15m'), // Cookie berlaku selama 15 menit
                },
            },
        ];
        return ResponseHelper.sendClearCookies(res, ApiResponse.success({ code: -1, message: 'Logged out' }, 'Logout success'), optionCookie);
    } catch (error) {
        logError('Error auth.controller logout : ', error);
        await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
        return;
    }
}
export async function attrb(req: Request, res: Response) {
    try {
        // const user = await authService.login(username, password);
        // logInfo("Auth.controller ",user);
        const data: any = req.userInfo;
        logInfo('USER INFO ', data);
        if (data.code === 'ERR_JWT_EXPIRED') {
            await ResponseHelper.send(res, ApiResponse.invalidToken(data.code));
            return;
        } else {
            await ResponseHelper.send(res, ApiResponse.success(data, 'Success Attrb'));
            return;
        }
    } catch (error) {
        logError('Error auth.controller : ', error);
        await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
        return;
    }
}
export async function getaclattrb(req: Request, res: Response) {
    try {
        console.log('####################################### getaclattrb');
        const userInfo: any = req.userInfo;
        const { routeUrl } = req.body;
        console.log('####################################### Payload ', routeUrl);
        const packageResult = await authService.selectAclAttrb(userInfo, req.body);
        if (packageResult.code === 20000) {
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

export async function registUser(req: Request, res: Response) {
    const { fullname, mobilename, email, username, password } = req.body;
    try {
        const userExist = await authService.getUniqueUser(username, mobilename, email);
        if (userExist.code === 20000) {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Username/mobile/email Already token!, please use else'));
            return;
        }
        const newPassword = await bcrypt.hash(password, 10);
        const payloadInser = {
            fullname: fullname,
            mobilename: mobilename,
            email: email,
            username: username,
            password: newPassword,
            isAdmin: 1,
        };
        const insertUser = await apiService.registerUser(payloadInser);
        logInfo('HASIL INSERT TABLE ', insertUser);
        if (insertUser.code !== 20000) {
            await ResponseHelper.send(res, ApiResponse.successNoData([], 'Unable to register data!'));
            return;
        }
        // if(insertUser.code=20000){
        //########################### Coba kirim Email
        const htmlMessage = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>User Registration</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background:#f4f6f8; color:#333; margin:0; padding:0; }
              .container { max-width:480px; background:#fff; margin:40px auto; border-radius:8px; padding:30px 40px; box-shadow:0 4px 16px rgba(0,0,0,0.1); }
              h1 { color:#007bff; margin-bottom:20px; font-weight:700; font-size:24px; }
              .content { font-size:16px; line-height:1.6; }
              .credential-box { background:#f1f5fb; border:1px solid #d1e2ff; border-radius:6px; padding:15px 20px; margin:20px 0; font-family: 'Courier New', Courier, monospace; font-size:15px; color:#1a237e; }
              .footer { font-size:14px; color:#777; margin-top:30px; text-align:center; }
            </style>
            </head>
            <body>
            <div class="container">
              <h1>User Registration</h1>
              <div class="content">
                <p>Your credential is:</p>
                <div class="credential-box">
                  <p><strong>User ID :</strong> ${username}</p>
                  <p><strong>Password :</strong> ${password}</p>
                </div>
                <p>Please change the password after you are logged in.</p>
              </div>
              <div class="footer">
                <p>Thank you for registering with us!</p>
              </div>
            </div>
            </body>
            </html>`;
        await ResponseHelper.send(res, ApiResponse.success(insertUser.data, 'Success'));
        return;
    } catch (error) {
        logError('Error auth.controller : ', error);
        await ResponseHelper.send(res, ApiResponse.serverError(error + ''));
        return;
    }
}
function convertToMaxAge(timeString: string): number {
    const match = timeString.match(/^(\d+)([smhd])$/);
    if (!match) {
        throw new Error('Format waktu tidak valid. Gunakan format seperti "5m", "1h", dll.');
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
        case 's':
            return value * 1000; // Detik ke milidetik
        case 'm':
            return value * 60 * 1000; // Menit ke milidetik
        case 'h':
            return value * 60 * 60 * 1000; // Jam ke milidetik
        case 'd':
            return value * 24 * 60 * 60 * 1000; // Hari ke milidetik
        default:
            throw new Error('Unit waktu tidak dikenal.');
    }
}
