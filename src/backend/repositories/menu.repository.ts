import db from '../database/client';
export class MenuRepository {
  async findAllMenu() {
    const result = await db.select([
      'mm.idMenu',
      'mm.nameMenu',
      'mm.pathMenu',
      'mm.idAppMenu',
      'mm.created_at',
      'mm.created_by',
      'mm.updated_at',
      'mm.updated_by',
      'mm.iconMenu'
    ]).from('m_menus as mm').orderBy("mm.created_at");
    return result;
  }
  async findAllMenuMigrate() {
    const result = await db.select([
      'mm.nameMenu',
      'mm.pathMenu',
      'mm.idAppMenu',
      'mm.created_at',
      'mm.created_by',
      'mm.updated_at',
      'mm.updated_by',
      'mm.iconMenu'
    ]).from('m_menus as mm').orderBy("mm.created_at");
    return result;
  }
  async findAllMenuById(idMenu:string) {
    const result = await db.select([
      'mm.idMenu',
      'mm.nameMenu',
      'mm.pathMenu',
      'mm.idAppMenu',
      'mm.created_at',
      'mm.created_by',
      'mm.updated_at',
      'mm.updated_by',
      'mm.iconMenu'
    ]).from('m_menus as mm').where("mm.idMenu", idMenu).first();
    return result;
  }
  async addMenu(payload: any) {
    const query = await db('m_menus').insert(payload).returning("idMenu");
    return query;
  }
  async updMenu(payload: any) {
    const query = await db('m_menus').update(payload).where("idMenu", payload.idMenu).returning("idMenu");
    return query;
  }
  async delMenu(payload: any) {
    const query = await db('m_menus').delete().where("idMenu", payload.idMenu);
    return query;
  }
  async findAllIconsPrime() {
    const result = await db.select([
      'mi.id',
      'mi.code',
      'mi.type',
      'mi.codeother',
      'mi.description'
    ]).from('m_icons as mi').where("mi.type","prime").orderBy("mi.description");
    return result;
  }
  async findAllIconsPrimeMigrate() {
    const result = await db.select([
      'mi.code',
      'mi.type',
      'mi.codeother',
      'mi.description'
    ]).from('m_icons as mi').where("mi.type","prime").orderBy("mi.description");
    return result;
  }
}
