import { SQLiteDBConnection } from "react-sqlite-hook";
import { sqlite } from "../App";
import { formatDate } from "../utils/general";

class WorkDaysModel {

    constructor() { };

    public getWorkDay = async (date: Date, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            const results = await dbToUse.query(`SELECT * FROM work_days WHERE work_date = ?`, [formatDate(date, "%Y-%M-%D")])
            return results.values ? results.values[0] : null;
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };

    public createWorkDay = async (workDay: { workDate: Date, boxClosedOn: number, boxRealValue: number, servicesTotalPrice: number, employeeEarningsTotal: number }, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            await dbToUse.query(`INSERT INTO work_days VALUES (?,?,?,?,?)`, [formatDate(workDay.workDate, "%Y-%M-%D"), workDay.boxClosedOn, workDay.boxRealValue, workDay.servicesTotalPrice, workDay.employeeEarningsTotal]);
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };

    public deleteWorkDay = async (workDate: Date, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            await dbToUse.query(`DELETE FROM work_days WHERE work_date = ?`, [formatDate(workDate, "%Y-%M-%D")]);
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };

    public getWorkDaysRange = async (givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            const results = await dbToUse.query(`SELECT MIN(work_date) AS range_min,MAX(work_date) AS range_max FROM work_days`)
            return results.values ? results.values[0] : null;
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };


};

export { WorkDaysModel };