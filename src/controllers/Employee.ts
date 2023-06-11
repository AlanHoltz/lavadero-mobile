import { SQLiteDBConnection } from "react-sqlite-hook";
import { EmployeeModel } from "../models";

class EmployeeController {

    private employeeModel;

    constructor() {
        this.employeeModel = new EmployeeModel();
    };

    public getEmployees = async (givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.employeeModel.getEmployees(givenDatabase);
        }
        catch (err: any) {
            throw err;
        }
    };


    public createEmployee = async (name: string, isPrivileged: boolean, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.employeeModel.createEmployee(name, isPrivileged, givenDatabase);
        } catch (err: any) {
            throw err;
        }
    };

    public deleteEmployeeByName = async (name: string, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.employeeModel.deleteEmployeeByName(name, givenDatabase);
        } catch (err: any) {
            throw err;
        }
    };


    public updateEmployee = async (originalName: string, employeeData: { name: string, isPrivileged: boolean }, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.employeeModel.updateEmployee(originalName, employeeData, givenDatabase);
        } catch (err: any) {
            throw err;
        }
    };
}

export { EmployeeController };