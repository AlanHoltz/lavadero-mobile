export interface ServiceData {
    serviceName: { isValid: boolean, isTouched: boolean, value: string },
    serviceType: string,
    clientPhone: { isValid: boolean, isTouched: boolean, value: string };
    finalPrice: { isValid: boolean, isTouched: boolean, value: null | number },
    isSpecial: boolean,
    serviceMadeBy: string | null,
};

export interface ServiceTypeData {
    name: { isValid: boolean, isTouched: boolean, value: string },
    price: { isValid: boolean, isTouched: boolean, value: number | null },
};

export interface EmployeeData {
    name: { isValid: boolean, isTouched: boolean, value: string },
    isPrivileged: boolean,
    serviceTypes: Array<{ serviceName: string, serviceEarnings: { isTouched: boolean, isValid: boolean, value: number | null } }>
}

export interface GlobalStats {
    servicesTotalPrice: number,
    employeeEarningsTotal: number,
    servicesByType: { [serviceType: string]: { amount: number, total: number, isSpecial: boolean }, },
    earningsByEmployee: { [employeeName: string]: number };

}