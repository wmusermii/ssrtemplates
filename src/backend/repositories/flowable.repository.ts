import db from '../database/client';
export class FlowableRepository {
  async flowableParamByGrpKey(payload:any) {
    const result = await db.select([
      'fp.id_param',
      'fp.fa_key',
      'fp.fa_group',
      'fp.fa_value',
    ]).from('flowable_param as fp').where("fp.fa_key", payload.fa_key).andWhere("fp.fa_group", payload.fa_group).first();
    return result;
  }
  async flowableParamByGrp(payload:any) {
    console.log("PAYLOAD ", payload);
    const result = await db.select([
      'fp.id_param',
      'fp.fa_key',
      'fp.fa_group',
      'fp.fa_value',
    ]).from('flowable_param as fp').where("fp.fa_group", payload.fa_group);
    // .where("fp.fa_group", payload.fa_group)
    return result;
  }
}
