import db from '../database/client';
export class ParamRepository {
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

}
