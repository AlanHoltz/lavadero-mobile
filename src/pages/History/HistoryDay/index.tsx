import { useState } from "react";
import LayoutPage from "../../../components/LayoutPage";
import WorkDayDetails from "../../../components/WorkDayDetails";
import { useEffect } from "react";
import { WorkDayEarningsByServiceTypesController, WorkDayEmployeeEarningsController, WorkDaysController } from "../../../controllers";
import { sqlite } from "../../../App";
import { deepClone } from "../../../utils/general";
import { IonText, useIonAlert } from "@ionic/react";

interface HistoryDayProps {
    date: string,
    setModal: any,
};

const workDaysController: WorkDaysController = new WorkDaysController();
const workDayEarningsByServiceTypesController: WorkDayEarningsByServiceTypesController = new WorkDayEarningsByServiceTypesController();
const workDayEmployeeEarningsController: WorkDayEmployeeEarningsController = new WorkDayEmployeeEarningsController();

const HistoryDay: React.FC<HistoryDayProps> = (props) => {

    const [presentAlert] = useIonAlert();
    const [loading, setLoading] = useState(false);
    const [boxClosedOn, setBoxClosedOn] = useState<{ value: number | null, isTouched: boolean, isValid: boolean }>({ value: null, isTouched: false, isValid: false })
    const [globalStats, setGlobalStats] = useState<{ employeeEarningsTotal: number, servicesByType: { [serviceType: string]: { amount: number, total: number, isSpecial: boolean }, }, servicesTotalPrice: number, earningsByEmployee: { [employeeName: string]: number } }>({
        servicesByType: {},
        servicesTotalPrice: 0,
        earningsByEmployee: {},
        employeeEarningsTotal: 0,
    });
    const [noWorkDate, setNoWorkDate] = useState(false);

    const initialFetch = async () => {
        try {
            setLoading(true);
            const date = new Date(`${props.date} 00:00`);
            const db = await sqlite.createConnection("Lavadero");
            await db.open();
            const workDay = await workDaysController.getWorkDay(date, db);
            if (!workDay) {
                setNoWorkDate(true);
                return;
            };
            const workDayEarningsByServiceTypes = await workDayEarningsByServiceTypesController.getWorkDayEarningsByServiceTypes(date, db);
            const workDayEmployeeEarnings = await workDayEmployeeEarningsController.getEmployeeEarningsByDate(date, db);
            const globalStatsCpy = deepClone(globalStats);
            workDayEarningsByServiceTypes.forEach(wDEBST => globalStatsCpy.servicesByType[wDEBST.service_type] = { amount: 0, isSpecial: true, total: wDEBST.price })
            globalStatsCpy.servicesTotalPrice = workDay.services_total_price;
            globalStatsCpy.employeeEarningsTotal = workDay.employee_earnings_total;
            workDayEmployeeEarnings.forEach(wDEE => globalStatsCpy.earningsByEmployee[wDEE.employee_name] = wDEE.earnings);
            setGlobalStats(globalStatsCpy);
        }
        catch (err: any) {
            await presentAlert({
                header: "Error",
                message: err.message,
                buttons: ["Ok"],
            });
        }
        finally {
            if (await sqlite.isConnection("Lavadero")) await sqlite.closeConnection("Lavadero");
            setLoading(false);
        };
    };

    useEffect(() => {
        (async function () {
            await initialFetch();
        })();
    }, []);

    return (
        <LayoutPage showLoading={loading} allowGoBack onBackButtonClick={() => props.setModal(false)} title={props.date} wrapIonPage={false}>
            {!noWorkDate && <WorkDayDetails showClarification={false} boxClosedOn={boxClosedOn} globalStats={globalStats} />}
            {noWorkDate && <IonText className="ion-text-center" color="primary" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                <p>
                    EL DÍA ACTUAL NO PRESENTA SERVICIOS REALIZADOS
                </p>
            </IonText>}
        </LayoutPage>
    )
};

export default HistoryDay;