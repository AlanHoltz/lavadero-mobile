import { SQLiteDBConnection } from "react-sqlite-hook";
import { sqlite } from "../App";

class EmployeeEarningsModel {
    constructor() { };

    public getEmployeeEarningsByServiceType = async (serviceType: string, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            const results = await dbToUse.query(`SELECT * FROM employee_earnings ee
            INNER JOIN employees e ON e.employee_name = ee.employee_name
            WHERE ee.service_type_name = ?
            ;`, [serviceType]);
            return results.values ?? [];
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };

    public getEmployeeEarningsByEmployeeName = async (employeeName: string, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            const results = await dbToUse.query(`SELECT * FROM employee_earnings ee
            INNER JOIN employees e ON e.employee_name = ee.employee_name
            WHERE e.employee_name = ?
            ORDER BY service_type_name DESC
            ;`, [employeeName]);
            return results.values ?? [];
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };

    public getEmployeeEarnings = async (givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            const results = await dbToUse.query(`SELECT * FROM employee_earnings ee
            INNER JOIN employees e ON e.employee_name = ee.employee_name;`);
            return results.values ?? [];
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };

    public createEmployeeEarning = async (eEData: { employeeName: string, serviceType: string, price: number }, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            await dbToUse.query(`INSERT INTO employee_earnings VALUES (?,?,?)`, [eEData.employeeName, eEData.serviceType, eEData.price]);
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };

    public updateEmployeeEarning = async (eEPK: { employeeName: string, serviceType: string }, price: number, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            await dbToUse.query(`UPDATE employee_earnings SET current_earnings = ? WHERE employee_name = ? AND service_type_name = ?`,
                [price, eEPK.employeeName, eEPK.serviceType]);
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };
};

export { EmployeeEarningsModel };