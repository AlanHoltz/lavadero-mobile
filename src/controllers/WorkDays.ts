import { SQLiteDBConnection } from "react-sqlite-hook";
import { WorkDaysModel } from "../models";

class WorkDaysController {

    private workDaysModel: WorkDaysModel;

    constructor() {
        this.workDaysModel = new WorkDaysModel();
    }

    public getWorkDay = async (date: Date, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.workDaysModel.getWorkDay(date, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };

    public createWorkDay = async (workDay: { workDate: Date, boxClosedOn: number, boxRealValue: number, servicesTotalPrice: number, employeeEarningsTotal: number }, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.workDaysModel.createWorkDay(workDay, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };

    public deleteWorkDay = async (workDate: Date, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.workDaysModel.deleteWorkDay(workDate, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };

    public getWorkDaysRange = async (givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.workDaysModel.getWorkDaysRange(givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };
}

export { WorkDaysController };