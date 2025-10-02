import { Router } from 'express';
import { addGroups, addMenus, addRoles,  addUsers,  delGroups,  delMenus, delRoles, delUsers, echo, getGroupsAvailable, getIcons,  getMenusAvailable, getParamsByGroup, getParamsByKey, getRolesAvailable, getTestDatabase, getUsersAvailable, goMigrateDatabase, updateUser, updGroupMenu, updGroups, updMenus, updParamsByGroup, updRoles, updUsers } from '../controllers/api.controller';
import { attrb, getaclattrb, login, logout, registUser } from '../controllers/auth.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { CookieMiddleware } from '../middlewares/cookiemiddleware';
import { authBearerMiddleware } from '../middlewares/authmiddleware';
const router = Router();
router.get('/echo', echo);
//##################################### REAL FUNCTION#############

//##################################### AUTH ROUTES #############
router.post('/auth/login', asyncHandler(login));
router.get('/auth/logout', asyncHandler(CookieMiddleware),asyncHandler(logout));
router.post('/auth/registuser', asyncHandler(registUser));
router.get('/auth/attrb',asyncHandler(CookieMiddleware), asyncHandler(attrb));
router.post('/auth/aclattrb', asyncHandler(CookieMiddleware),asyncHandler(getaclattrb));
router.post('/auth/updateuser', asyncHandler(CookieMiddleware),asyncHandler(updateUser));
//##################################### AUTH ROUTES END #############

router.post('/admin/test_database', asyncHandler(CookieMiddleware),asyncHandler(getTestDatabase)); //Mengetest database tujuan
router.post('/admin/migrate_database', asyncHandler(CookieMiddleware),asyncHandler(goMigrateDatabase)); //Mengetest database tujuan

//##################################### WEB ADMIN ROUTES #############
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
//##################################### WEB ADMIN ROUTES END #############

//##################################### EMAIL #############
// router.post('/warehouse/send_email', asyncHandler(sendingEmailTo));// Untuk cek apaka package yang di ambil sudah diambil user lain
//##################################### Printing #############

export default router;
