import { parseLogFile } from "../utils/parseLog";
import ExcelJS from "exceljs";
import { createObjectCsvWriter } from "csv-writer";
import path from "path";
import { nanoid } from "nanoid";
import { logError } from "../utils/logger";
import { ResponseHelper } from "../utils/ResponseHelper";
import { ApiResponse } from "../utils/apiResponse";
import { Request, Response, NextFunction } from 'express';
import { parseLogsByDateRange } from "../utils/parseLogsByDateRange";
import { ApiService } from "../services/api.service";

const apiService = new ApiService();
export async function uploadFile(request: Request, res: Response) {
    try {
        const req: any = request;
        const filter = req.body;

        const logs = await parseLogsByDateRange(filter);

        const id = nanoid();
        const format = filter.format || "csv";
        const fileName = `audit-report-${id}.${format}`;
        const outputPath = path.join("upload", fileName);

        if (format === "csv") {
            const csvWriter = createObjectCsvWriter({
                path: outputPath,
                header: Object.keys(logs[0] || {}).map(k => ({ id: k, title: k }))
            });
            await csvWriter.writeRecords(logs);
        }

        if (format === "xlsx") {
            const wb = new ExcelJS.Workbook();
            const ws = wb.addWorksheet("Audit Logs");

            ws.columns = Object.keys(logs[0] || {}).map(k => ({ header: k, key: k }));
            ws.addRows(logs);

            await wb.xlsx.writeFile(outputPath);
        }


        let payload = {
            file_name: fileName,
            file_path: `/reports/${fileName}`,
            format: format,
            created_by: req.userInfo?.username || "system"
        }
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.insertReportHistory(userInfo, payload);
        if (packageResult.code === 20000) {
            await ResponseHelper.send(res, packageResult);
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], "Unable to insert data"));
        }
        return ResponseHelper.send(res, ApiResponse.success({ url: `/reports/${fileName}`, totalRows: logs.length }));
    } catch (error) {
        logError("Error REPORT GEENRATE : ", error)
        await ResponseHelper.send(res, ApiResponse.serverError(error + "")); return;
    }
}

export async function getUploadFileHistory(request: Request, res: Response) {
    try {
        const req: any = request;
        const userInfo: any = req.userInfo;
        const packageResult = await apiService.getReportHistory(userInfo);
        if (packageResult.code === 20000 && packageResult.data.length > 0) {
            await ResponseHelper.send(res, packageResult); return;
        } else {
            await ResponseHelper.send(res, ApiResponse.successNoData([], "Unable to generate data"));
            return;
        }
    } catch (error) {
        logError("Error REPORT HISTORY : ", error)
        await ResponseHelper.send(res, ApiResponse.serverError(error + "")); return;
    }
}