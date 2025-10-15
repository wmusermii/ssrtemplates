import { v4 as uuidv4 } from 'uuid';
import db from '../database/client';
export class UserRepository {
    async findByUsername(username: string) {
        const result = await db
            .select('mu.iduser', 'mu.username', 'mu.password', 'mu.fullname', 'mu.mobile', 'mu.email', 'mu.isAdmin', 'mg.groupname', 'mg.menublob')
            .from('m_user as mu')
            .leftJoin('m_group as mg', 'mu.idgroup', 'mg.idgroup')
            .where('username', username)
            .first();
        return result;
    }
    async findByUsernamePassword(username: string, password: string) {
        const result = await db
            .select([
                'mu.iduser',
                'mu.username',
                'mu.password',
                'mu.fullname',
                'mu.mobile',
                'mu.email',
                'mu.isAdmin',
                'mg.idgroup',
                'mg.groupname',
                'mg.menublob',
            ])
            .from('m_user as mu')
            .leftJoin('m_group as mg', 'mu.idgroup', 'mg.idgroup')
            .where({ username: username, password: password })
            .first();
        return result;
    }
    async registerUser(payload: any) {
        const uid = uuidv4();
        const query = await db('m_user')
            .insert({
                iduser: uid + '',
                username: payload.username,
                created_by: uid,
                created_at: new Date().toLocaleString('sv-SE').replace('T', ' '), // ← lokal time,
                idgroup: payload.groupCode,
                fullname: payload.fullname,
                mobile: payload.mobilename,
                email: payload.email,
                password: payload.password,
                isAdmin: payload.isAdmin,
                deleteable: 0,
            })
            .returning('iduser');

        return query;
    }
    async updateUser(payload: any, userinfo: any) {
        let syntax: any = {};
        if (payload.changepassword) {
            syntax = {
                username: payload.username,
                created_by: userinfo.iduser,
                updated_at: new Date().toLocaleString('sv-SE').replace('T', ' '), // ← lokal time,
                fullname: payload.fullname,
                mobile: payload.mobile,
                email: payload.email,
                password: payload.password,
            };
        } else {
            syntax = {
                username: payload.username,
                created_by: userinfo.iduser,
                updated_at: new Date().toLocaleString('sv-SE').replace('T', ' '), // ← lokal time,
                fullname: payload.fullname,
                mobile: payload.mobile,
                email: payload.email,
            };
        }
        console.log('SYNTAX ', syntax);

        const query = await db('m_user').update(syntax).where('iduser', payload.iduser).returning('iduser');

        return query;
    }
    //################################################################## FOR CRUD #############################################
    async findAllUserMigrate() {
        const result = await db
            .select([
                'mu.iduser',
                'mu.username',
                'mu.password',
                'mu.fullname',
                'mu.mobile',
                'mu.email',
                'mu.idgroup',
                'mu.deleteable',
                'mu.created_by',
                'mu.created_at',
                'mu.updated_by',
                'mu.updated_at',
                'mu.status',
                'mg.groupname',
            ])
            .from('m_user as mu')
            .innerJoin('m_group as mg', 'mu.idgroup', 'mg.idgroup');
        return result;
    }
    async findAllUsers(userinfo: any) {
        const result = await db
            .select([
                'mu.iduser',
                'mu.username',
                'mu.password',
                'mu.fullname',
                'mu.mobile',
                'mu.email',
                'mu.idgroup',
                'mu.deleteable',
                'mu.created_by',
                'mu.created_at',
                'mu.updated_by',
                'mu.updated_at',
                'mu.status',
                'mg.groupname',
            ])
            .from('m_user as mu')
            .innerJoin('m_group as mg', 'mu.idgroup', 'mg.idgroup')
            .whereNot({ 'mu.iduser': userinfo.iduser, 'mu.deleteable': 0 });
        return result;
    }
    async findAllUsersById(userinfo: any, payload: any) {
        const result = await db
            .select([
                'mu.iduser',
                'mu.username',
                'mu.password',
                'mu.fullname',
                'mu.mobile',
                'mu.email',
                'mu.idgroup',
                'mu.deleteable',
                'mu.created_by',
                'mu.created_at',
                'mu.updated_by',
                'mu.updated_at',
                'mu.status',
                'mg.groupname',
            ])
            .from('m_user as mu')
            .innerJoin('m_group as mg', 'mu.idgroup', 'mg.idgroup')
            .where({ iduser: payload.iduser })
            .first();
        return result;
    }
    async addUser(payload: any) {
        const query = await db('m_user').insert(payload).returning('iduser');
        return query;
    }
    async updUser(payload: any) {
        console.log('PAYLOAD UPDATE ', payload);
        const query = await db('m_user').update(payload).where('iduser', payload.iduser).returning('iduser');
        return query;
    }
    async updUserMenu(payload: any) {
        const query = await db('m_user').update(payload).where('iduser', payload.iduser).returning('iduser');
        return query;
    }

    async delUser(payload: any) {
        const query = await db('m_user').delete().where('iduser', payload.iduser);
        return query;
    }

    async findByUniqueUser(username: string, mobile: string, email: string) {
        const result = await db
            .select(['mu.iduser', 'mu.username', 'mu.password', 'mu.fullname', 'mu.mobile', 'mu.email', 'mg.groupname', 'mg.menublob'])
            .from('m_user as mu')
            .innerJoin('m_group as mg', 'mu.idgroup', 'mg.idgroup')
            .where('username', username)
            .orWhere('mobile', mobile)
            .orWhere('email', email)
            .first();
        return result;
    }
}
