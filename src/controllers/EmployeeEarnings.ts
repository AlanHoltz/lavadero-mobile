import { SQLiteDBConnection } from "react-sqlite-hook";
import { EmployeeEarningsModel } from "../models";

class EmployeeEarningsController {

    private employeeEarningsModel;

    constructor() {
        this.employeeEarningsModel = new EmployeeEarningsModel();
    };

    public getEmployeeEarningsByServiceType = async (serviceType: string, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.employeeEarningsModel.getEmployeeEarningsByServiceType(serviceType, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };

    public getEmployeeEarningsByEmployeeName = async (employeeName: string, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.employeeEarningsModel.getEmployeeEarningsByEmployeeName(employeeName, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };

    public createEmployeeEarning = async (eEData: { employeeName: string, serviceType: string, price: number }, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.employeeEarningsModel.createEmployeeEarning(eEData, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };

    public getEmployeeEarnings = async (givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.employeeEarningsModel.getEmployeeEarnings(givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };

    public updateEmployeeEarning = async (eEPK: { employeeName: string, serviceType: string }, price: number, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.employeeEarningsModel.updateEmployeeEarning(eEPK, price, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };
}

export { EmployeeEarningsController };