import db from '../database/client';
import { logInfo } from '../utils/logger';
export class ParamRepository {

  async findParamExternal() {
    // logInfo("📊 findParamExternal ")
    const result = await db.select([
      'mg.id',
      'mg.paramgroup',
      'mg.paramkey',
      'mg.paramvalue',
      'mg.description',
    ]).from('m_param as mg')
    .whereNotIn('mg.paramgroup', ['GENERAL', 'SMTPATTRB', 'PASSATTRB'])
    .orderBy('mg.id', 'asc');
    // logInfo("📊 Hasil get params external",result)
    return result;
  }
// , 'PASSATTRB'

  async findParamForMigration() {
    const result = await db.select([
      'mg.paramgroup',
      'mg.paramkey',
      'mg.paramvalue',
    ]).from('m_param as mg').orderBy("mg.id", "asc");
    return result;
  }
  async findParamByGroup(payload:any) {
    const result = await db.select([
      'mg.id',
      'mg.paramgroup',
      'mg.paramkey',
      'mg.paramvalue',
    ]).from('m_param as mg').where("mg.paramgroup", payload.paramgroup).orderBy("mg.id", "asc");
    return result;
  }
  async findParamByKey(payload:any) {
    const result = await db.select([
      'mg.id',
      'mg.paramgroup',
      'mg.paramkey',
      'mg.paramvalue',
    ]).from('m_param as mg').where("mg.paramgroup", payload.paramgroup).andWhere("mg.paramkey",payload.paramkey).first();
    return result;
  }
   async updParamByKey(payload:any) {
    const query = await db('m_param').update(payload).where("paramkey", payload.paramkey).returning("id");
    return query;
  }
  async addParam(payload:any) {
    const query = await db('m_param').insert(payload).returning("id");
    return query;
  }
  async updParam(payload:any) {
    const query = await db('m_param').update(payload).where("id", payload.id).returning("id");
    return query;
  }
  async delParam(payload:any) {
    const query = await db('m_param').delete().where("id", payload.id);
    return query;
  }
}
