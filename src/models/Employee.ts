import { SQLiteDBConnection } from "react-sqlite-hook";
import { sqlite } from "../App";

class EmployeeModel {
    constructor() { };

    public getEmployees = async (givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            const results = await dbToUse.query(`SELECT * FROM employees ORDER BY employee_privileged DESC`);
            return results.values ?? [];
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };


    public createEmployee = async (name: string, isPrivileged: boolean, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            await dbToUse.query(`INSERT INTO employees VALUES (?,?)`, [name, isPrivileged]);
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };

    public deleteEmployeeByName = async (name: string, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            await dbToUse.query(`DELETE FROM employees WHERE employee_name = ?`, [name]);
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };

    public updateEmployee = async (originalName: string, employeeData: { name: string, isPrivileged: boolean }, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            await dbToUse.query(`UPDATE employees SET employee_name=?,employee_privileged=? WHERE employee_name = ?`, [employeeData.name, employeeData.isPrivileged, originalName]);
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };
};

export { EmployeeModel };