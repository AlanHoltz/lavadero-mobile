import { SQLiteDBConnection } from "react-sqlite-hook";
import { sqlite } from "../App";
import { formatDate } from "../utils/general";

class ServiceModel {


    constructor() { };

    public getServicesByDate = async (date: Date, orderBy: "datetime" | "special_price" = "datetime", givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            const results = await dbToUse.query(`SELECT 
            s.service_datetime,s.service_name,s.service_client_phone,s.service_special_price,s.service_made_by,s.service_type_name,st.service_type_price
            FROM services s
            LEFT JOIN service_types st ON s.service_type_name = st.service_type_name
            WHERE date(s.service_datetime) = '${formatDate(date, '%Y-%M-%D')}' 
            ORDER BY ${orderBy === "datetime" ? "s.service_datetime DESC" : "s.service_special_price ASC"}; `);
            return results.values ?? [];
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };

    public getServiceByNameAndDatetime = async (name: string, datetime: string, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            const results = await dbToUse.query(`SELECT 
            s.service_datetime,s.service_name,s.service_client_phone,s.service_special_price,s.service_made_by,st.service_type_name,st.service_type_price
            FROM services s
            INNER JOIN service_types st ON s.service_type_name = st.service_type_name
            WHERE s.service_datetime = ? AND s.service_name = ?`, [datetime, name]);
            return results.values ? results.values[0] : null;

        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };


    public createService = async (newService: { currentMoment: string, serviceName: string, clientPhone: string | null, serviceType: string, specialPrice: number | null, serviceMadeBy: string | null }, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            await dbToUse.query("INSERT INTO services VALUES (?,?,?,?,?,?)",
                [newService.currentMoment, newService.serviceName, newService.clientPhone, newService.serviceType, newService.specialPrice, newService.serviceMadeBy]);
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };

    };

    public deleteService = async (name: string, datetime: string, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            await dbToUse.query("DELETE FROM services WHERE service_name = ? AND service_datetime = ?",
                [name, datetime]);
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };

    public updateService = async (name: string, datetime: string, updatedService: { currentMoment: string, serviceName: string, clientPhone: string | null, serviceType: string, specialPrice: number | null, serviceMadeBy: string | null }, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            const dbToUse = givenDatabase ?? await sqlite.createConnection("Lavadero");
            if (!givenDatabase) await dbToUse.open();
            await dbToUse.query(`
            UPDATE services
            SET service_name = ?, service_client_phone = ?, service_type_name = ?, service_special_price = ?, service_made_by = ?
            WHERE service_name = ? AND service_datetime = ?; 
             `,
                [updatedService.serviceName, updatedService.clientPhone, updatedService.serviceType, updatedService.specialPrice, updatedService.serviceMadeBy, name, datetime]);
        }
        catch (err: any) {
            throw err;
        }
        finally {
            if (!givenDatabase) await sqlite.closeConnection("Lavadero");
        };
    };

};

export { ServiceModel };