import db from '../database/client';
import { logInfo } from '../utils/logger';
export class UploadFileRepository {

  async getUploadFileHistory() {
    logInfo("📊 getUploadFileHistory ")
    const result = await db.select([
      'mu.file_name',
      'mu.file_path',
      'mu.format',
      'mu.created_by',
      'mu.created_at',
    ])
    .from('m_upload as mu')
    .orderBy('mu.id', 'desc');
    logInfo("📊 Hasil getUploadFileHistory ",result)
    return result;
  }

  async insertUploadFileHistory(payload: any) {
    const query = await db('m_upload').insert(payload).returning("id");
    return query;
  }
}
