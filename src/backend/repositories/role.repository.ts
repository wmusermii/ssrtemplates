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
}
