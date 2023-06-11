import LayoutPage from "../../../components/LayoutPage";
import { useIonAlert, IonGrid, IonCol, IonRow, IonButton, IonIcon } from "@ionic/react";
import { useEffect, useState } from "react";
import { sqlite } from "../../../App";
import { ServiceController, WorkDayEarningsByServiceTypesController } from "../../../controllers";
import { EmployeeEarningsController } from "../../../controllers";
import { formatNumber } from "../../../utils/general";
import { checkmarkOutline } from "ionicons/icons";
import PriceInput from "../../../components/PriceInput";
import { WorkDaysController } from "../../../controllers";
import { WorkDayEmployeeEarningsController } from "../../../controllers";
import WorkDayDetails from "../../../components/WorkDayDetails";

interface MainDetailProps {
    setDetailModal: any,
};

interface IServicesStats {
    [serviceType: string]: { amount: number, total: number, isSpecial: boolean },
};

interface IEarningsByEmployee {
    [employeeName: string]: number;
};

const workDayEarningsByServiceTypes: WorkDayEarningsByServiceTypesController = new WorkDayEarningsByServiceTypesController();
const serviceController: ServiceController = new ServiceController();
const employeeEarningsController: EmployeeEarningsController = new EmployeeEarningsController();
const workDayEmployeeEarningsController: WorkDayEmployeeEarningsController = new WorkDayEmployeeEarningsController();
const workDaysController: WorkDaysController = new WorkDaysController();

const MainDetail: React.FC<MainDetailProps> = (props) => {

    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState<any[]>([]);
    const [presentAlert] = useIonAlert();
    const [boxIsClosed, setBoxIsClosed] = useState(false);
    const [employeeEarnings, setEmployeeEarnings] = useState<any[]>([]);
    const [boxClosedOn, setBoxClosedOn] = useState<{ value: number | null, isTouched: boolean, isValid: boolean }>({ value: null, isTouched: false, isValid: false })
    const [globalStats, setGlobalStats] = useState<{ employeeEarningsTotal: number, servicesByType: IServicesStats, servicesTotalPrice: number, earningsByEmployee: IEarningsByEmployee }>({
        servicesByType: {},
        servicesTotalPrice: 0,
        earningsByEmployee: {},
        employeeEarningsTotal: 0,
    });

    const initialFetch = async () => {
        try {
            setLoading(true);
            const db = await sqlite.createConnection("Lavadero");
            await db.open();
            const fetchedServices: any = await serviceController.getServicesByDate(new Date(), "special_price", db);
            setServices([...fetchedServices]);
            const fetchedEmployeeEarnings: any = await employeeEarningsController.getEmployeeEarnings(db);
            setEmployeeEarnings([...fetchedEmployeeEarnings])
            const workDay = await workDaysController.getWorkDay(new Date(), db);
            if (workDay) {
                setBoxIsClosed(true);
                setBoxClosedOn({ ...boxClosedOn, value: workDay.box_closed_on, isTouched: true, isValid: true });
            };
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
            setLoading(false);
        };

    };

    const getGlobalStats = () => {
        const employees = Array.from(new Set(employeeEarnings.map(ee => ee.employee_name)));
        let servicesTotalPrice = 0;
        let employeeEarningsTotal = 0;
        const servicesStats: IServicesStats = {};
        const earningsByEmployee: IEarningsByEmployee = {};

        services.forEach(service => {
            if (!service.service_special_price) {
                if (!servicesStats[service.service_type_name]) servicesStats[service.service_type_name] = { amount: 0, total: 0, isSpecial: false };
                servicesStats[service.service_type_name].amount += 1;
                servicesStats[service.service_type_name].total += service.service_type_price;
                servicesTotalPrice += service.service_type_price;
            } else {
                if (servicesStats[service.service_name]) {
                    servicesStats[service.service_name].amount += 1;
                    servicesStats[service.service_name].total += service.service_special_price;
                }
                else {
                    servicesStats[service.service_name] = { amount: 1, total: service.service_special_price, isSpecial: true };
                };
                servicesTotalPrice += service.service_special_price;
            };

            for (const empName of employees) {
                if (service.service_made_by && (empName !== service.service_made_by)) continue;
                if (!earningsByEmployee[empName]) earningsByEmployee[empName] = 0;
                const serviceTypeEarningForEmployee = employeeEarnings.find(ee => ee.service_type_name === service.service_type_name && ee.employee_name === empName);
                let earnings = 0;
                if (service.service_special_price && serviceTypeEarningForEmployee.employee_privileged) {
                    let notPrivilegedEmployee = null;
                    if (!service.service_made_by) notPrivilegedEmployee = employeeEarnings.find(ee => !ee.employee_privileged && ee.service_type_name === service.service_type_name);
                    earnings = service.service_made_by ? service.service_special_price * 0.30 : service.service_special_price * 0.30 - notPrivilegedEmployee.current_earnings;
                    earningsByEmployee[empName] += earnings;
                    employeeEarningsTotal += earnings;
                } else {
                    earnings = service.service_made_by ? serviceTypeEarningForEmployee.current_earnings * 2 : serviceTypeEarningForEmployee.current_earnings;
                    earningsByEmployee[empName] += earnings;
                    employeeEarningsTotal += earnings;
                };

            };
        })

        setGlobalStats({ servicesByType: servicesStats, servicesTotalPrice, earningsByEmployee, employeeEarningsTotal });

    };

    useEffect(() => {
        (async function () {
            await initialFetch();
        })()
    }, []);


    useEffect(() => {
        (async function () {
            getGlobalStats();
        })()
    }, [boxIsClosed, services, employeeEarnings]);

    const onBoxCloseClick = async () => {
        const boxCpy = { ...boxClosedOn };
        if (!boxCpy.isTouched) boxCpy.isTouched = true;
        setBoxClosedOn({ ...boxCpy });
        if (!boxCpy.isValid) return;
        await presentAlert({
            header: "¿Cerrar la Caja?",
            message: `Vas a cerrar la caja con $${formatNumber(boxClosedOn.value ?? 0)}. ¿Continuar?`,
            buttons: [
                {
                    text: "Cancelar",
                    role: "cancel"
                },
                {
                    text: "Confirmar",
                    role: "confirm",
                    handler: onBoxCloseConfirm,
                }
            ]
        })

    };


    const onBoxCloseConfirm = async () => {
        try {
            setLoading(true);
            const now = new Date();
            const db = await sqlite.createConnection("Lavadero");
            await db.open();
            await workDaysController.createWorkDay({ workDate: now, boxClosedOn: (boxClosedOn.value ?? 0), boxRealValue: (globalStats.servicesTotalPrice - globalStats.employeeEarningsTotal), servicesTotalPrice: globalStats.servicesTotalPrice, employeeEarningsTotal: globalStats.employeeEarningsTotal }, db)
            for (const empName in globalStats.earningsByEmployee) {
                await workDayEmployeeEarningsController.createWorkDayEmployeeEarnings({ workDate: new Date(), employeeName: empName, earnings: globalStats.earningsByEmployee[empName] }, db)
            };
            for (const sT in globalStats.servicesByType) {
                let serviceTypeName;

                if (globalStats.servicesByType[sT].isSpecial) {
                    if (globalStats.servicesByType[sT].amount > 1) {
                        serviceTypeName = `${sT} x${globalStats.servicesByType[sT].amount}`;

                    } else {
                        serviceTypeName = sT;
                    };
                } else {
                    serviceTypeName = `Vehículo ${sT} x${globalStats.servicesByType[sT].amount}`;
                };

                await workDayEarningsByServiceTypes.createWorkDayEarningsByServiceTypes({
                    date: new Date(),
                    service_type: serviceTypeName,
                    price: globalStats.servicesByType[sT].total,
                }, db);
            };
            setBoxIsClosed(true);
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
            setLoading(false);
        };
    };

    const onBoxOpenClick = async () => {
        await presentAlert({
            header: "¿Abrir la Caja?",
            message: `Vas a abrir la caja nuevamente. ¿Continuar?`,
            buttons: [
                {
                    text: "Cancelar",
                    role: "cancel"
                },
                {
                    text: "Confirmar",
                    role: "confirm",
                    handler: onBoxOpenConfirm,
                }
            ]
        })

    };

    const onBoxOpenConfirm = async () => {

        try {
            setLoading(true);
            await workDaysController.deleteWorkDay(new Date());
            /*await presentToast({
                message: "Caja abierta con éxito",
                duration: 1500,
                position: "top",
                color: "success",

            });*/
            setBoxIsClosed(false);
        }
        catch (err: any) {
            await presentAlert({
                header: "Error",
                message: err.message,
                buttons: ["Ok"],
            });
        }
        finally {
            setLoading(false);
        };
    };

    return (
        <LayoutPage toolbar={
            boxIsClosed &&
            <div className="ion-margin">
                <IonButton shape="round" expand="full" onClick={onBoxOpenClick} color="secondary">Abrir Caja</IonButton>
            </div>
        } onBackButtonClick={() => {
            props.setDetailModal(false);
        }} wrapIonPage={false} showLoading={loading} title={"Detalles de Hoy"} allowGoBack>
            {!boxIsClosed && <IonGrid>
                <IonRow className="ion-align-items-center ion-justify-content-between">
                    <IonCol>
                        <PriceInput
                            button={<IonButton slot="end" onClick={onBoxCloseClick} size="small" color="primary" fill="solid">
                                <IonIcon icon={checkmarkOutline} />
                            </IonButton>}
                            label="Cerrar Caja en" error={!boxClosedOn.isValid && boxClosedOn.isTouched ? "Monto mayor a 0" : null} onChange={(price: number) => {
                                const boxCpy = { ...boxClosedOn };
                                if (!boxCpy.isValid) boxCpy.isValid = true;
                                boxCpy.value = price;
                                setBoxClosedOn({ ...boxCpy })
                            }} onBlur={() => {
                                const boxCpy = { ...boxClosedOn };
                                if (!boxCpy.isTouched) boxCpy.isTouched = true;
                                if ((boxCpy.value ?? 0) <= 0) boxCpy.isValid = false;
                                setBoxClosedOn({ ...boxCpy });
                            }} price={boxClosedOn.value} />
                    </IonCol>
                </IonRow>
            </IonGrid>}
            {boxIsClosed && <WorkDayDetails boxClosedOn={boxClosedOn} globalStats={globalStats} employeeEarnings={employeeEarnings} showClarification />}
        </LayoutPage>
    )
};


export default MainDetail;