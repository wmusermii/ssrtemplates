import db from '../database/client';
export class RoleRepository {
  async findAllRole() {
    const result = await db.select([
      'mr.idRole',
      'mr.roleName',
      'mr.roleDescription'
    ]).from('m_role as mr').orderBy("mr.idRole");
    return result;
  }
  async findAllRoleById(idRole:string) {
    const result = await db.select([
      'mr.idRole',
      'mr.roleName',
      'mr.roleDescription'
    ]).from('m_role as mr').where("mr.idRole", idRole).first();
    return result;
  }
  async addRole(payload: any) {
    const query = await db('m_role').insert(payload).returning("idRole");
    return query;
  }
  async updRole(payload: any, idRoleOld:string) {
    const query = await db('m_role').update(payload).where("idRole", idRoleOld).returning("idRole");
    return query;
  }
  async delRole(payload: any) {
    const query = await db('m_role').delete().where("idRole", payload.idRole);
    return query;
  }
}
