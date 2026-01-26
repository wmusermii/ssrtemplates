import { eachDayOfInterval, format } from "date-fns";
import path from "path";
import fs from "fs";

export function getLogFiles(fromDate: string, toDate: string) {
  const dates = eachDayOfInterval({
    start: new Date(fromDate),
    end: new Date(toDate)
  });

  return dates
    .map(d => {
      const name = `log-access-${format(d, "yyyy-MM-dd")}.log`;
      return path.join(process.cwd(), "logs", name);
    })
    .filter(fs.existsSync); // only existing files
}
