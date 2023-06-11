import { SQLiteDBConnection } from "react-sqlite-hook";
import { WorkDayEmployeeEarningsModel } from "../models";


class WorkDayEmployeeEarningsController {

    private workDayEmployeeEarningsModel: WorkDayEmployeeEarningsModel;

    constructor() {
        this.workDayEmployeeEarningsModel = new WorkDayEmployeeEarningsModel();
    }

    public getEmployeeEarningsByDate = async (date: Date, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.workDayEmployeeEarningsModel.getEmployeeEarningsByDate(date, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };

    public createWorkDayEmployeeEarnings = async (workDayEmployeeEarnings: { employeeName: string, workDate: Date, earnings: number }, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.workDayEmployeeEarningsModel.createWorkDayEmployeeEarnings(workDayEmployeeEarnings, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };
}

export { WorkDayEmployeeEarningsController };