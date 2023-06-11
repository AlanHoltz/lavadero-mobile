import EmployeeForm from "../../../../components/EmployeeForm";
import { EmployeeData } from "../../../../utils/interfaces";
import { useEffect, useState } from "react";
import { EmployeeController, EmployeeEarningsController } from "../../../../controllers";
import { deepClone } from "../../../../utils/general";
import { useIonAlert, useIonToast } from '@ionic/react';

interface ConfigurationEmployeesEditProps {
    setModal: any,
    name: string,
    isPrivileged: boolean,
};

const employeeEarningsController: EmployeeEarningsController = new EmployeeEarningsController();
const employeeController: EmployeeController = new EmployeeController();

const ConfigurationEmployeesEdit: React.FC<ConfigurationEmployeesEditProps> = (props) => {

    const [employeeData, setEmployeeData] = useState<EmployeeData>({
        name: { isValid: true, isTouched: false, value: props.name },
        isPrivileged: props.isPrivileged,
        serviceTypes: [],
    });
    const [presentAlert] = useIonAlert();
    const [presentToast] = useIonToast();

    const [swiper, setSwiper] = useState<any>();

    const employeeOriginalName = props.name;


    useEffect(() => {
        (async function () {
            try {
                const eeByName = await employeeEarningsController.getEmployeeEarningsByEmployeeName(employeeOriginalName);
                const eDCpy = deepClone(employeeData);
                eeByName.forEach(ee => eDCpy.serviceTypes.push({
                    serviceName: ee.service_type_name,
                    serviceEarnings: { isValid: true, isTouched: false, value: ee.current_earnings }
                }));
                setEmployeeData({ ...eDCpy });
            }
            catch (err: any) {
                await presentAlert({
                    header: "Error",
                    message: err.message,
                    buttons: ["Ok"],
                });
            };
        })()
    }, []);

    const onAcceptInformationClick = async () => {
        try {
            await employeeController.updateEmployee(employeeOriginalName, { name: employeeData.name.value, isPrivileged: employeeData.isPrivileged });
            await presentToast({
                message: "Información de empleado editada con éxito",
                duration: 1500,
                position: "top",
                color: "success",

            });
            props.setModal(false);
        }
        catch (err: any) {
            await presentAlert({
                header: "Error",
                message: err.message,
                buttons: ["Ok"],
            });
        };
    };

    const onAcceptEarningsClick = async () => {
        try {
            for (const sT of employeeData.serviceTypes) {
                await employeeEarningsController.updateEmployeeEarning({ employeeName: employeeOriginalName, serviceType: sT.serviceName }, sT.serviceEarnings.value ?? 0);
            };
            await presentToast({
                message: "Cobros de empleado editados con éxito",
                duration: 1500,
                position: "top",
                color: "success",

            });
        }
        catch (err: any) {
            await presentAlert({
                header: "Error",
                message: err.message,
                buttons: ["Ok"],
            });
        };
    };

    return (
        <EmployeeForm onAcceptEarningsClick={onAcceptEarningsClick} setSwiper={setSwiper} swiper={swiper} onAcceptInformationClick={onAcceptInformationClick} setEmployeeData={setEmployeeData} employeeData={employeeData} formTitle="Editar Empleado" setModal={props.setModal} />
    )

};

export default ConfigurationEmployeesEdit;