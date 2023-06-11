import LayoutPage from "../../../components/LayoutPage";
import { IonList, IonItem, IonLabel, IonText, IonButton, IonModal, IonIcon, useIonViewWillEnter, useIonAlert, IonCol, IonGrid, IonRow, useIonToast } from "@ionic/react";
import { trashOutline, pencilOutline, carOutline } from 'ionicons/icons';
import { ServiceTypeController, WorkDaysController } from "../../../controllers";
import { useState } from "react";
import { addOutline } from "ionicons/icons";
import ConfigurationServicesNew from "./ConfigurationServicesNew";
import ConfigurationServicesEdit from "./ConfigurationServicesEdit";
import { sqlite } from "../../../App";

const serviceTypeController: ServiceTypeController = new ServiceTypeController();
const workDaysController: WorkDaysController = new WorkDaysController();

const ConfigurationServices: React.FC = () => {


    const [serviceTypes, setServiceTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [presentAlert] = useIonAlert();
    const [presentToast] = useIonToast();
    const [newServiceTypeModal, setNewServiceTypeModal] = useState(false);
    const [editServiceTypeModal, setEditServiceTypeModal] = useState(false);
    const [selectedService, setSelectedService] = useState<{ name: string | null, price: number | null }>({ name: null, price: null });
    const [workDay, setWorkDay] = useState();

    const initialFetch = async () => {
        try {
            setLoading(true);
            const db = await sqlite.createConnection("Lavadero");
            await db.open();
            const wD = await workDaysController.getWorkDay(new Date(), db);
            setWorkDay(wD ? { ...wD } : null);
            const sT = await serviceTypeController.getServiceTypes(db);
            setServiceTypes([...sT]);
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

    useIonViewWillEnter(async () => {
        await initialFetch();
    }, []);


    return (
        <LayoutPage showLoading={loading} noPaddingContent title="Configurar Servicios" allowGoBack>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonButton disabled={Boolean(workDay)} onClick={() => setNewServiceTypeModal(true)} expand="full">
                            <IonIcon icon={addOutline} />
                            <IonLabel>
                                Nuevo
                            </IonLabel>
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
            <IonList className="ion-no-padding">
                {serviceTypes.map(sT => <ConfigurationServicesElement workDayIsClosed={Boolean(workDay)} setEditServiceTypeModal={setEditServiceTypeModal} setSelectedService={setSelectedService} initialFetch={initialFetch} setLoading={setLoading} presentAlert={presentAlert} presentToast={presentToast} key={sT.service_type_name} name={sT.service_type_name} price={sT.service_type_price} />)}
            </IonList>
            <IonModal onIonModalWillDismiss={async () => { setNewServiceTypeModal(false); await initialFetch() }} isOpen={newServiceTypeModal}>
                <ConfigurationServicesNew setModal={setNewServiceTypeModal} />
            </IonModal>
            <IonModal onIonModalWillDismiss={async () => { setEditServiceTypeModal(false); setSelectedService({ name: null, price: null }); await initialFetch() }} isOpen={editServiceTypeModal}>
                {<ConfigurationServicesEdit selectedService={selectedService} setModal={setEditServiceTypeModal} />}
            </IonModal>
        </LayoutPage>
    )
};

interface ConfigurationServicesElementProps {
    name: string,
    price: number,
    presentAlert: any,
    presentToast: any,
    setLoading: any,
    initialFetch: any,
    setSelectedService: any,
    setEditServiceTypeModal: any,
    workDayIsClosed: boolean,
};

const ConfigurationServicesElement: React.FC<ConfigurationServicesElementProps> = (props) => {

    const handleDelete = async () => {
        try {
            props.setLoading(true);
            await serviceTypeController.deleteServiceType(props.name);
            await props.presentToast({
                message: "Tipo de Servicio eliminado con éxito",
                duration: 1500,
                position: "top",
                color: "success",
            })
            await props.initialFetch();
        }
        catch (err: any) {
            await props.presentAlert({
                header: "Error",
                message: err.message,
                buttons: ["Ok"],
            });
        }
        finally {
            props.setLoading(false);
        };

    };

    const onDeleteClick = async () => {
        await props.presentAlert({
            header: "Borrar Tipo de Servicio",
            message: `Estás a punto de eliminar Vehículo ${props.name}. ¿Confirmar?`,
            buttons: [
                {
                    text: "Cancelar",
                    role: "cancel"
                },
                {
                    text: "Confirmar",
                    role: "confirm",
                    handler: handleDelete
                }
            ]
        });
    };

    return (
        <IonItem lines="full">
            <IonIcon color="primary" slot="start" icon={carOutline} />
            <IonLabel color="primary">
                <h2>
                    {`Vehículo ${props.name}`}
                </h2>
                <IonText>
                    <p>
                        ${props.price}
                    </p>
                </IonText>
            </IonLabel>
            <IonButton disabled={props.workDayIsClosed} onClick={() => { props.setSelectedService({ name: props.name, price: props.price }); props.setEditServiceTypeModal(true) }} size="small" color="primary" fill="solid">
                <IonIcon icon={pencilOutline} />
            </IonButton>
            <IonButton disabled={props.workDayIsClosed} onClick={onDeleteClick} size="small" color="primary" fill="solid">
                <IonIcon icon={trashOutline} />
            </IonButton>
        </IonItem>
    )
};

export default ConfigurationServices;