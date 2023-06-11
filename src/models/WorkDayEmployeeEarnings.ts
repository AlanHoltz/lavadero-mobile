import { SQLiteDBConnection } from "react-sqlite-hook";
import { sqlite } from "../App";
import { formatDate } from "../utils/general";

class WorkDayEmployeeEarningsModel {

    constructor() { };

    public getEmployeeEarningsByDate = async (date: Date, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            const results = await dbToUse.query(`SELECT * FROM work_day_employee_earnings WHERE date(work_date) = '${formatDate(date, "%Y-%M-%D")}'`)
            return results.values ?? [];
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };

    public createWorkDayEmployeeEarnings = async (workDayEmployeeEarnings: { employeeName: string, workDate: Date, earnings: number }, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            await dbToUse.query(`INSERT INTO work_day_employee_earnings VALUES (?,?,?)`, [workDayEmployeeEarnings.employeeName, formatDate(workDayEmployeeEarnings.workDate, "%Y-%M-%D"), workDayEmployeeEarnings.earnings]);
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };

};

export { WorkDayEmployeeEarningsModel };