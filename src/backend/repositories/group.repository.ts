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
  async findAllGroupMigrate() {
    const result = await db.select([
      'mg.idgroup',
      'mg.groupname',
      'mg.menublob',
      'mg.description',
    ]).from('m_group as mg').orderBy("mg.groupname", "asc");
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
    const query = await db('m_group').insert(payload).returning("idgroup");
    return query;
  }
  async updGroup(payload: any) {
    // console.log("PAYLOAD UPDATE ",payload);
    const query = await db('m_group').update(payload).where("idgroup", payload.idgroup).returning("idgroup");
    return query;
  }
  async updGroupMenu(payload: any) {
    const query = await db('m_group').update(payload).where("idgroup", payload.idgroup).returning("idgroup");
    return query;
  }

  async delGroup(payload: any) {
    const query = await db('m_group').delete().where("idgroup", payload.idgroup);
    return query;
  }

}
