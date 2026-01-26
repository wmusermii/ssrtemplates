import { getLogFiles } from "./getLogFile";
import { parseLogFile } from "./parseLog";

export async function parseLogsByDateRange(filter: any) {
  const files = getLogFiles(filter.fromDate, filter.toDate);
  const result = [];

  for (const file of files) {
    const rows = await parseLogFile(file, filter);
    result.push(...rows);
  }

  return result;
}
