import db from '../database/client';
export class GroupRepository {
  async findAllGroup() {
    const result = await db.select([
      'mg.idgroup',
      'mg.groupname',
      'mg.menublob',
      'mg.description',
    ]).from('m_group as mg').whereNot("mg.idgroup", "100000000001").orderBy("mg.groupname", "asc");
    return result;
  }
  async findAllGroupById(idGroup:string) {
    const result = await db.select([
      'mg.idgroup',
      'mg.groupname',
      'mg.menublob',
      'mg.description',
    ]).from('m_group as mg').where("mg.idgroup", idGroup).first();
    return result;
  }
  async addGroup(payload: any) {
    const query = await db('m_group').insert(payload).returning("idGroup");
    return query;
  }
  async updGroup(payload: any) {
    const query = await db('m_group').update(payload).where("idGroup", payload.idGroup).returning("idGroup");
    return query;
  }
  async delGroup(payload: any) {
    const query = await db('m_group').delete().where("idGroup", payload.idGroup);
    return query;
  }

}
