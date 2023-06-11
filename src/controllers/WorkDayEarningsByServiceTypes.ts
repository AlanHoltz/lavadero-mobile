import { SQLiteDBConnection } from "react-sqlite-hook";
import { WorkDayEarningsByServiceTypesModel } from "../models";

class WorkDayEarningsByServiceTypesController {

    private workDayEarningsByServiceTypesModel: WorkDayEarningsByServiceTypesModel;

    constructor() {
        this.workDayEarningsByServiceTypesModel = new WorkDayEarningsByServiceTypesModel();
    }

    public getWorkDayEarningsByServiceTypes = async (date: Date, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.workDayEarningsByServiceTypesModel.getWorkDayEarningsByServiceTypes(date, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };

    public createWorkDayEarningsByServiceTypes = async (workDayEarningsByServiceTypes: { date: Date, service_type: string, price: number }, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.workDayEarningsByServiceTypesModel.createWorkDayEarningsByServiceTypes(workDayEarningsByServiceTypes, givenDatabase);
        } catch (err: any) {
            throw err;
        };
    };

}

export { WorkDayEarningsByServiceTypesController };