import db from '../database/client';
import { logInfo } from '../utils/logger';
export class ReportRepository {

  async getReportHistory() {
    logInfo("📊 getReportHistory ")
    const result = await db.select([
      'mr.file_name',
      'mr.file_path',
      'mr.format',
      'mr.created_by',
      'mr.created_at',
    ])
    .from('m_report as mr')
    .orderBy('mr.id', 'desc');
    logInfo("📊 Hasil get ReportHistory ",result)
    return result;
  }

  async insertReportHistory(payload: any) {
    const query = await db('m_report').insert(payload).returning("id");
    return query;
  }
}
