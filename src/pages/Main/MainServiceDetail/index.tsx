import LayoutPage from "../../../components/LayoutPage";
import { useQuery } from "../../../hooks/useQuery";
import { useState } from 'react';
import { ServiceController } from "../../../controllers";
import { useHistory } from "react-router";
import { useIonToast, useIonAlert, IonButton, IonCard, IonList, IonItem, IonCardTitle, IonCardSubtitle, IonCardContent, IonRow, IonCol, IonIcon, IonLabel, IonCardHeader, IonText, IonModal, useIonViewWillEnter } from "@ionic/react";
import { formatDate } from "../../../utils/general";
import { callOutline, carSportOutline, personOutline, trashOutline, pencilOutline } from "ionicons/icons";
import { EmployeeEarningsController } from "../../../controllers/";
import { sqlite } from "../../../App";
import { formatNumber } from "../../../utils/general";
import MainServiceDetailEdit from "./MainServiceDetailEdit";
import Pricing, { PricingElement } from "../../../components/Pricing";
import { WorkDaysController } from "../../../controllers";

const workDaysController: WorkDaysController = new WorkDaysController();
const serviceController: ServiceController = new ServiceController();
const employeeEarningsController: EmployeeEarningsController = new EmployeeEarningsController();


const MainServiceDetails: React.FC = () => {

    const queryParams = useQuery();
    const history = useHistory();
    const [presentAlert] = useIonAlert();
    const [presentToast] = useIonToast();
    const serviceName = queryParams.get("name");
    const serviceDatetime = queryParams.get("datetime");
    const [loading, setLoading] = useState(false);
    const [service, setService] = useState<any>({});
    const [employeeEarnings, setEmployeeEarnings] = useState<any[]>([]);
    const [editServiceModal, setEditServiceModal] = useState(false);
    const [workDay, setWorkDay] = useState<any>(null);

    useIonViewWillEnter(() => {
        (async function () {
            await initialFetch();
        })()
    }, [])

    const initialFetch = async () => {
        try {
            setLoading(true);
            if (!serviceName || !serviceDatetime) return history.replace("/main");
            const db = await sqlite.createConnection("Lavadero");
            await db.open();
            const fetchedService: any = await serviceController.getServiceByNameAndDatetime(serviceName ?? "", serviceDatetime ?? "", db);
            if (!fetchedService) {
                await sqlite.closeConnection("Lavadero");
                history.replace("/main")
                return;
            };
            setService({ ...fetchedService });
            const fetchedEmployeeEarnings: any = await employeeEarningsController.getEmployeeEarningsByServiceType(fetchedService.service_type_name, db);
            setEmployeeEarnings([...fetchedEmployeeEarnings])
            const wD = await workDaysController.getWorkDay(new Date(), db);
            setWorkDay(wD ? { ...wD } : null);
        }
        catch (err: any) {
            await presentAlert({
                header: "Error",
                message: err.message,
                buttons: ["Ok"],
            });
        }
        finally {
            const connExists = await sqlite.isConnection("Lavadero");
            if (connExists.result) await sqlite.closeConnection("Lavadero");
            setLoading(false);
        };

    };

    const calculateTotalPrice = () => {
        let employeesCost = 0;
        let subtotal = service.service_special_price ?? service.service_type_price;
        for (const ee of employeeEarnings) {
            if (service.service_made_by && ee.employee_name !== service.service_made_by) continue;
            if (ee.employee_privileged && service.service_special_price) {
                let notPrivilegedEmployee = null;
                if (!service.service_made_by) notPrivilegedEmployee = employeeEarnings.find(ee => !ee.employee_privileged && ee.service_type_name === service.service_type_name);
                if(notPrivilegedEmployee === undefined) return;
                employeesCost += service.service_made_by ? service.service_special_price * 0.30 : service.service_special_price * 0.30 - notPrivilegedEmployee.current_earnings;
            }
            else {
                employeesCost += service.service_made_by ? ee.current_earnings * 2 : ee.current_earnings;
            }
        };

        return subtotal - employeesCost;
    };

    const deleteService = async () => {
        try {
            setLoading(true);
            await serviceController.deleteService(service.service_name, service.service_datetime);
            await presentToast({
                message: "Servicio eliminado con éxito",
                duration: 1500,
                position: "top",
                color: "success",

            });
            history.replace("/main");

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

    const notPrivilegedEmployee = employeeEarnings.find(ee => !ee.employee_privileged);
    const serviceMadeBy = service.service_made_by === null ? null : employeeEarnings.find(ee => ee.employee_name === service.service_made_by)

    return (
        <LayoutPage showLoading={loading} allowGoBack>
            <IonCard className="ion-margin-bottom ion-padding">
                <IonRow className="ion-justify-content-between">
                    <IonCol className="ion-no-padding" size="auto">
                        <IonCardTitle color="primary">
                            {service.service_name}
                        </IonCardTitle>
                    </IonCol>
                    {!workDay && <IonCol className="ion-no-padding" size="auto">
                        <IonButton onClick={() => setEditServiceModal(true)} size="small" color="primary" fill="solid">
                            <IonIcon icon={pencilOutline} />
                        </IonButton>
                        <IonButton onClick={() => presentAlert({
                            header: "Eliminar Servicio",
                            message: `¿Estás seguro que deseas eliminar el servicio ${service.service_name}?`,
                            buttons: [{
                                text: "Cancelar",
                                role: "cancel",
                            }, {
                                text: "Confirmar",
                                role: "confirm",
                                handler: deleteService
                            }]
                        })} size="small" color="primary" fill="solid">
                            <IonIcon icon={trashOutline} />
                        </IonButton>
                    </IonCol>}
                </IonRow>
                <IonRow>
                    <IonCardSubtitle>
                        Servicio del {formatDate(new Date(service.service_datetime), "%ds %D-%M a las %h:%m")}
                    </IonCardSubtitle>
                </IonRow>
            </IonCard>
            <IonCard className="ion-margin-bottom">
                <IonCardHeader>
                    <IonCardTitle color="primary">
                        Datos del Servicio
                    </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonList>
                        <IonItem lines="none" className="ion-no-padding">
                            <IonIcon size="small" color="primary" icon={carSportOutline} />
                            <IonText color="primary" className="ion-margin-start">{`Vehículo ${service.service_type_name} (${service.service_special_price ? "Servicio Especial de " : ""}$${formatNumber(Number(service.service_special_price ?? service.service_type_price))})`}</IonText>
                        </IonItem>
                        <IonItem lines="none" className="ion-no-padding">
                            <IonIcon size="small" color="primary" icon={callOutline} />
                            <IonText color="primary" className="ion-margin-start">{service.service_client_phone ?? "No has registrado un teléfono"}</IonText>
                        </IonItem>
                        <IonItem lines="none" className="ion-no-padding">
                            <IonIcon size="small" color="primary" icon={personOutline} />
                            <IonText color="primary" className="ion-margin-start">{service.service_made_by === null ? "Todos los Empleados" : service.service_made_by}</IonText>
                        </IonItem>
                    </IonList>
                </IonCardContent>
            </IonCard>
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle color="primary">
                        Gastos
                    </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <Pricing total={Number(calculateTotalPrice())} subtotal={Number(service.service_special_price ?? service.service_type_price)}>
                        {!serviceMadeBy && employeeEarnings.map(ee => (
                            <PricingElement price={Number(ee.employee_privileged && service.service_special_price ? (service.service_special_price * 0.30 - notPrivilegedEmployee.current_earnings) : ee.current_earnings)} isSpent key={ee.employee_name} name={ee.employee_name} />
                        ))}
                        {serviceMadeBy && <PricingElement price={Number(serviceMadeBy?.employee_privileged && service.service_special_price ? service.service_special_price * 0.30 : serviceMadeBy?.current_earnings * 2)} isSpent name={serviceMadeBy?.employee_name} />}
                    </Pricing>
                </IonCardContent>
            </IonCard>
            <IonModal onIonModalWillDismiss={async () => { setEditServiceModal(false); await initialFetch() }} isOpen={editServiceModal}>
                <MainServiceDetailEdit currentService={service} setEditServiceModal={setEditServiceModal} />
            </IonModal>
        </LayoutPage >
    )
};


export default MainServiceDetails;