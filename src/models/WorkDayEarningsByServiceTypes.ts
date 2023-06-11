import { SQLiteDBConnection } from "react-sqlite-hook";
import { sqlite } from "../App";
import { formatDate } from "../utils/general";

class WorkDayEarningsByServiceTypesModel {

    constructor() { };

    public getWorkDayEarningsByServiceTypes = async (date: Date, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            const results = await dbToUse.query(`SELECT * FROM work_day_earnings_by_service_types WHERE date(work_date) = '${formatDate(date, "%Y-%M-%D")}'`)
            return results.values ?? [];
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };

    public createWorkDayEarningsByServiceTypes = async (workDayEarningsByServiceTypes: { date: Date, service_type: string, price: number }, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            await dbToUse.query(`
            INSERT INTO work_day_earnings_by_service_types
            VALUES (?,?,?)
            `, [formatDate(workDayEarningsByServiceTypes.date, "%Y-%M-%D"), workDayEarningsByServiceTypes.service_type, workDayEarningsByServiceTypes.price])
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };


};

export { WorkDayEarningsByServiceTypesModel };