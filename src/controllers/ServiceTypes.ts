import { SQLiteDBConnection } from "react-sqlite-hook";
import { ServiceTypeModel } from "../models";

class ServiceTypeController {

    private serviceTypeModel: ServiceTypeModel;

    constructor() {
        this.serviceTypeModel = new ServiceTypeModel();
    }

    public getServiceTypes = async (givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.serviceTypeModel.getServiceTypes(givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };

    public createServiceType = async (sTName: string, price: number, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.serviceTypeModel.createServiceType(sTName, price, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };


    public deleteServiceType = async (sTName: string, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.serviceTypeModel.deleteServiceType(sTName, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };

    public updateServiceType = async (sTName: string, sTData: { name: string, price: number }, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.serviceTypeModel.updateServiceType(sTName, sTData, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };
}

export { ServiceTypeController };