import EmployeeForm from "../../../../components/EmployeeForm";
import { useEffect, useState } from "react";
import { EmployeeData } from "../../../../utils/interfaces";
import { useIonAlert, useIonToast } from "@ionic/react";
import { EmployeeController, EmployeeEarningsController, ServiceTypeController } from "../../../../controllers";
import { deepClone } from "../../../../utils/general";
import { sqlite } from "../../../../App";

interface ConfigurationEmployeesEditProps {
    setModal: any,

};

const serviceTypeController: ServiceTypeController = new ServiceTypeController();
const employeeController: EmployeeController = new EmployeeController();
const employeeEarningsController: EmployeeEarningsController = new EmployeeEarningsController();

const ConfigurationEmployeesNew: React.FC<ConfigurationEmployeesEditProps> = (props) => {

    const [employeeData, setEmployeeData] = useState<EmployeeData>({
        name: { isValid: false, isTouched: false, value: "" },
        isPrivileged: false,
        serviceTypes: [],
    });

    const [presentAlert] = useIonAlert();
    const [presentToast] = useIonToast();
    const [allowSetEarnings, setAllowSetEarnings] = useState(false);
    const [swiper, setSwiper] = useState<any>();

    useEffect(() => {
        (async function () {
            const emCpy = deepClone(employeeData);
            const sTRes = await serviceTypeController.getServiceTypes();
            sTRes.forEach(sT => emCpy.serviceTypes.push({ serviceName: sT.service_type_name, serviceEarnings: { isTouched: false, isValid: false, value: null } }));
            setEmployeeData(deepClone(emCpy));
        })()
    }, []);

    const onAcceptInformationClick = async () => {
        try {
            setAllowSetEarnings(true);
            swiper.slideNext();
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
            const db = await sqlite.createConnection("Lavadero");
            await db.open();
            await employeeController.createEmployee(employeeData.name.value, employeeData.isPrivileged, db);
            for (const sT of employeeData.serviceTypes) {
                await employeeEarningsController.createEmployeeEarning({
                    employeeName: employeeData.name.value,
                    serviceType: sT.serviceName,
                    price: sT.serviceEarnings.value ?? 0,
                }, db);
            };
            await presentToast({
                message: "Empleado creado con éxito",
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
        }
        finally {
            await sqlite.closeConnection("Lavadero");
            props.setModal(false);
        };
    };


    return (
        <EmployeeForm onAcceptEarningsClick={onAcceptEarningsClick} swiper={swiper} setSwiper={setSwiper} allowSetEarnings={allowSetEarnings} onAcceptInformationClick={onAcceptInformationClick} setEmployeeData={setEmployeeData} employeeData={employeeData} formTitle="Nuevo Empleado" setModal={props.setModal} />
    )

};

export default ConfigurationEmployeesNew;