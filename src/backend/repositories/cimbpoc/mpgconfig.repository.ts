import dbPg from '../../database/clientPg';
export class MpgConfigurationRepository {
  async findAllBussinesList() {
    const result = await dbPg.select([
      'mm.id',
      'mm.title',
      'mm.description',
      'mm.blopmodel',
      'mm.created_at',
      'mm.created_by',
      'mm.updated_at',
      'mm.updated_by'
    ]).from('t_flowdiagrams as mm').orderBy("mm.created_at", "asc");
    return result;
  }
  async findBussinesListById(id:string) {
    const result = await dbPg.select([
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
    const query = await dbPg('t_flowdiagrams').insert(payload).returning("id");
    return query;
  }
  async updBussinesList(payload: any) {
    const query = await dbPg('t_flowdiagrams').update(payload).where("id", payload.id).returning("id");
    return query;
  }
  async delBussinesList(payload: any) {
    const query = await dbPg('t_flowdiagrams').delete().where("id", payload.id);
    return query;
  }
}
