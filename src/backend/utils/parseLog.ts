import fs from "fs";
import readline from "readline";

export async function parseLogFile(filePath: string, filter: any) {
  const result = [];

  const stream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: stream });

  for await (const line of rl) {
    const idx = line.indexOf("{");
    if (idx === -1) continue;

    try {
      const json = JSON.parse(line.slice(idx));

      // FILTERS
      if (filter.auditType && json.auditType !== filter.auditType) continue;
      if (filter.systemName && json.systemName !== filter.systemName) continue;
      if (filter.userName && json.userName !== filter.userName) continue;
      if (filter.activity && json.activity !== filter.activity) continue;

      if (filter.fromDate && json.requestDate < filter.fromDate) continue;
      if (filter.toDate && json.requestDate > filter.toDate) continue;

      result.push(json);
    } catch {}
  }

  return result;
}
