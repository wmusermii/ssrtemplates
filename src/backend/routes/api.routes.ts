import { Router } from 'express';
import { addGroups, addMenus, addRoles,  addUsers,  delGroups,  delMenus, delRoles, delUsers, echo, getGroupsAvailable, getIcons,  getMenusAvailable, getParamsByGroup, getParamsByKey, getRolesAvailable, getTestDatabase, getUsersAvailable, goMigrateDatabase, updateUser, updGroupMenu, updGroups, updMenus, updParamsByGroup, updRoles, updUsers } from '../controllers/api.controller';
import { attrb, getaclattrb, login, logout, registUser } from '../controllers/auth.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { CookieMiddleware } from '../middlewares/cookiemiddleware';
// import { authBearerMiddleware } from '../middlewares/authmiddleware';
import rateLimit from 'express-rate-limit';
import { ParamRepository } from '../repositories/param.repository';
import { logInfo, logWarn } from '../utils/logger';
import { delSiapUbpCompany, getSiapUbpCompanies, getSiapUbpFormModel, getSiapUbpTableFields, postSiapUbpCompany, updSiapUbpCompany } from '../controllers/api.siapubp.controller';
import { delSiapBiFastBisnisList, getSiapBiFastBisnisById, getSiapBiFastBisnisList, postSiapBiFastBisnisList, updSiapBiFastBisnisList } from '../controllers/api.siapbifast.controller';
const router = Router();
router.get('/echo', echo);
//************************************* LIMIT RATE LOGIN *************
const loginLimiter = await createLoginLimiter();
//************************************* AUTH ROUTES *************
router.post('/auth/login', loginLimiter,asyncHandler(login));
router.get('/auth/logout', asyncHandler(CookieMiddleware),asyncHandler(logout));
router.post('/auth/registuser', asyncHandler(registUser));
router.get('/auth/attrb',asyncHandler(CookieMiddleware), asyncHandler(attrb));
router.post('/auth/aclattrb', asyncHandler(CookieMiddleware),asyncHandler(getaclattrb));
router.post('/auth/updateuser', asyncHandler(CookieMiddleware),asyncHandler(updateUser));
//************************************* AUTH ROUTES END *************

router.post('/admin/test_database', asyncHandler(CookieMiddleware),asyncHandler(getTestDatabase)); //Mengetest database tujuan
router.post('/admin/migrate_database', asyncHandler(CookieMiddleware),asyncHandler(goMigrateDatabase)); //Mengetest database tujuan

//************************************* WEB ADMIN ROUTES *************
router.post('/admin/get_parambygroup', asyncHandler(CookieMiddleware),asyncHandler(getParamsByGroup));
router.post('/admin/get_parambykey', asyncHandler(getParamsByKey));
router.post('/admin/upd_parambygroup', asyncHandler(updParamsByGroup));

router.get('/admin/get_roles', asyncHandler(CookieMiddleware),asyncHandler(getRolesAvailable)); //Melihat is daftar Role
router.post('/admin/add_role', asyncHandler(CookieMiddleware),asyncHandler(addRoles)); //Menambah is daftar Role
router.post('/admin/upd_role', asyncHandler(CookieMiddleware),asyncHandler(updRoles)); //Merubah is daftar Role
router.post('/admin/del_role', asyncHandler(CookieMiddleware),asyncHandler(delRoles)); //menghapus is daftar Role

router.get('/admin/get_icons', asyncHandler(CookieMiddleware),asyncHandler(getIcons)); //Melihat is daftar IconsPrimeNG
router.get('/admin/get_menus', asyncHandler(CookieMiddleware),asyncHandler(getMenusAvailable)); //Melihat is daftar menu
router.post('/admin/add_menu', asyncHandler(CookieMiddleware),asyncHandler(addMenus)); //Menambah is daftar Menu
router.post('/admin/upd_menu', asyncHandler(CookieMiddleware),asyncHandler(updMenus)); //Merubah is daftar Menu
router.post('/admin/del_menu', asyncHandler(CookieMiddleware),asyncHandler(delMenus)); //menghapus is daftar Menu

router.get('/admin/get_groups', asyncHandler(CookieMiddleware),asyncHandler(getGroupsAvailable)); //Melihat is daftar Group
router.post('/admin/add_group', asyncHandler(CookieMiddleware),asyncHandler(addGroups)); //Menambah is daftar Group
router.post('/admin/upd_group', asyncHandler(CookieMiddleware),asyncHandler(updGroups)); //Merubah is daftar Group
router.post('/admin/upd_group_menu', asyncHandler(CookieMiddleware),asyncHandler(updGroupMenu)); //Merubah is daftar Group
router.post('/admin/del_group', asyncHandler(CookieMiddleware),asyncHandler(delGroups)); //menghapus is daftar Group

router.get('/admin/get_users', asyncHandler(CookieMiddleware),asyncHandler(getUsersAvailable)); //Melihat is daftar User
router.post('/admin/add_user', asyncHandler(CookieMiddleware),asyncHandler(addUsers)); //Menambah is daftar User
router.post('/admin/upd_user', asyncHandler(CookieMiddleware),asyncHandler(updUsers)); //Merubah is daftar User
router.post('/admin/del_user', asyncHandler(CookieMiddleware),asyncHandler(delUsers)); //menghapus is daftar User
//************************************* WEB ADMIN ROUTES END *************
/***********************FOR Siap UBP **************************************/
// router.get('/siapubp/get_parambykey', asyncHandler(CookieMiddleware),asyncHandler(getUsersAvailable));
router.get('/siapubp/get_tablefields', asyncHandler(CookieMiddleware),asyncHandler(getSiapUbpTableFields)); //Melihat is daftar User
router.get('/siapubp/get_fieldmodel', asyncHandler(CookieMiddleware),asyncHandler(getSiapUbpFormModel));
router.get('/siapubp/get_companies', asyncHandler(CookieMiddleware),asyncHandler(getSiapUbpCompanies));
router.post('/siapubp/add_company', asyncHandler(CookieMiddleware),asyncHandler(postSiapUbpCompany));
router.post('/siapubp/upd_company', asyncHandler(CookieMiddleware),asyncHandler(updSiapUbpCompany));
router.post('/siapubp/del_company', asyncHandler(CookieMiddleware),asyncHandler(delSiapUbpCompany));

/***********************FOR Flowdiagram******************************/


/***************************************************************** **/
/***********************FOR BIFAST******************************/
router.get('/siapbifast/get_bisnislist', asyncHandler(CookieMiddleware),asyncHandler(getSiapBiFastBisnisList));
router.post('/siapbifast/get_bisnislistby', asyncHandler(CookieMiddleware),asyncHandler(getSiapBiFastBisnisById));
router.post('/siapbifast/add_bisnislist', asyncHandler(CookieMiddleware),asyncHandler(postSiapBiFastBisnisList));
router.post('/siapbifast/upd_bisnislist', asyncHandler(CookieMiddleware),asyncHandler(updSiapBiFastBisnisList));
router.post('/siapbifast/del_bisnislist', asyncHandler(CookieMiddleware),asyncHandler(delSiapBiFastBisnisList));

/*****************************************************************/
//************************************* EMAIL *************
// router.post('/warehouse/send_email', asyncHandler(sendingEmailTo));// Untuk cek apaka package yang di ambil sudah diambil user lain
//************************************* Printing *************
async function createLoginLimiter() {
  const defaultMax = 3;
  try {
    const paramRepo = new ParamRepository();
    const row = await paramRepo.findParamByKey({ paramgroup: 'GENERAL', paramkey: 'maxloginattempt' });
    const max = row && Number(row.paramvalue) ? Number(row.paramvalue) : defaultMax;
    logInfo('login limiter max set to', max);
    return rateLimit({
      windowMs: 60 * 1000,
      max,
      message: { message: 'Too many login attempts from this IP, try again later.' },
      standardHeaders: true,
      legacyHeaders: false
    });
  } catch (err) {
    logWarn('Could not read param for rate limit, using default. Error:', err);
    return rateLimit({
      windowMs: 5 * 1000,
      max: defaultMax,
      message: { message: 'Too many login attempts from this IP, try again later.' },
      standardHeaders: true,
      legacyHeaders: false
    });
  }
}
export default router;
