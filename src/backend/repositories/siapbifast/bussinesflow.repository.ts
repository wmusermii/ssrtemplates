import db from '../../database/client';
export class BussinesFlowRepository {
  async findAllBussinesList() {
    const result = await db.select([
      'mm.id',
      'mm.title',
      'mm.description',
      'mm.blopmodel',
      'mm.created_at',
      'mm.created_by',
      'mm.updated_at',
      'mm.updated_by'
    ]).from('t_flowdiagrams as mm').orderBy("mm.created_at", "desc");
    return result;
  }
  async findBussinesListById(id:string) {
    const result = await db.select([
      'mm.id',
      'mm.title',
      'mm.description',
      'mm.blopmodel',
      'mm.created_at',
      'mm.created_by',
      'mm.updated_at',
      'mm.updated_by'
    ]).from('t_flowdiagrams as mm').where("mm.id", id).first();
    return result;
  }
  async addBussinesList(payload: any) {
    const query = await db('t_flowdiagrams').insert(payload).returning("id");
    return query;
  }
  async updBussinesList(payload: any) {
    const query = await db('t_flowdiagrams').update(payload).where("id", payload.id).returning("id");
    return query;
  }
  async delBussinesList(payload: any) {
    const query = await db('t_flowdiagrams').delete().where("id", payload.id);
    return query;
  }
}
