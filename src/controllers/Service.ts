import { SQLiteDBConnection } from "react-sqlite-hook";
import { ServiceModel } from "../models";
import { formatDate } from "../utils/general";
import { ServiceData } from "../utils/interfaces";

class ServiceController {

    private serviceModel: ServiceModel;

    constructor() {
        this.serviceModel = new ServiceModel();
    }

    public getServicesByDate = async (date: Date, orderBy: "datetime" | "special_price" = "datetime", givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.serviceModel.getServicesByDate(date, orderBy, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };

    public getServiceByNameAndDatetime = async (name: string, datetime: string, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.serviceModel.getServiceByNameAndDatetime(name, datetime, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };

    public createService = async (newService: ServiceData, givenDatabase: SQLiteDBConnection | null = null) => {
        try {

            const currentMoment = formatDate(new Date(), "%Y-%M-%D %h:%m:%s");
            const formattedServiceData = {
                currentMoment,
                serviceName: newService.serviceName.value,
                clientPhone: newService.clientPhone.value.length === 0 ? null : newService.clientPhone.value,
                serviceType: newService.serviceType,
                specialPrice: newService.finalPrice.value,
                serviceMadeBy: newService.serviceMadeBy,
            };

            return await this.serviceModel.createService(formattedServiceData, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };

    public deleteService = async (name: string, datetime: string, givenDatabase: SQLiteDBConnection | null = null) => {
        try {
            return await this.serviceModel.deleteService(name, datetime, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };

    public updateService = async (name: string, datetime: string, updatedService: ServiceData, givenDatabase: SQLiteDBConnection | null = null) => {
        try {

            const currentMoment = formatDate(new Date(), "%Y-%M-%D %h:%m:%s");
            const formattedServiceData = {
                currentMoment,
                serviceName: updatedService.serviceName.value,
                clientPhone: updatedService.clientPhone.value.length === 0 ? null : updatedService.clientPhone.value,
                serviceType: updatedService.serviceType,
                specialPrice: updatedService.finalPrice.value,
                serviceMadeBy: updatedService.serviceMadeBy,
            };

            return await this.serviceModel.updateService(name, datetime, formattedServiceData, givenDatabase);
        }
        catch (err: any) {
            throw err;
        };
    };
}

export { ServiceController };