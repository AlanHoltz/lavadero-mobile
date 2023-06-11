import LayoutPage from "../../../components/LayoutPage";
import { useState } from "react";
import { useIonViewWillEnter, IonButton, IonChip, IonItem, IonLabel, IonList, IonIcon, IonGrid, IonRow, useIonToast, IonText, useIonAlert, IonModal, IonCol } from "@ionic/react";
import { addOutline, pencilOutline, trashOutline } from "ionicons/icons";
import { EmployeeController, WorkDaysController } from "../../../controllers";
import ConfigurationEmployeesEdit from "./ConfigurationEmployeesEdit";
import ConfigurationEmployeesNew from "./ConfigurationEmployeesNew";
import { sqlite } from "../../../App";

const employeeController: EmployeeController = new EmployeeController();
const workDaysController: WorkDaysController = new WorkDaysController();

const ConfigurationEmployees: React.FC = () => {

    const [loading, setLoading] = useState(false);
    const [presentAlert] = useIonAlert();
    const [presentToast] = useIonToast();
    const [employees, setEmployees] = useState<any[]>([]);
    const [editEmployeeModal, setEditEmployeeModal] = useState(false);
    const [newEmployeeModal, setNewEmployeeModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>({ name: null, isPrivileged: null });
    const [workDay, setWorkDay] = useState();

    const initialFetch = async () => {
        try {
            setLoading(true);
            const db = await sqlite.createConnection("Lavadero");
            await db.open();
            const wD = await workDaysController.getWorkDay(new Date(), db);
            setWorkDay(wD ? { ...wD } : null);
            const empRes = await employeeController.getEmployees(db);
            setEmployees([...empRes]);
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
        <LayoutPage showLoading={loading} noPaddingContent title="Configurar Empleados" allowGoBack>
            {employees.length < 2 && <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonButton disabled={Boolean(workDay)} onClick={() => setNewEmployeeModal(true)} expand="full">
                            <IonIcon icon={addOutline} />
                            <IonLabel>
                                Nuevo
                            </IonLabel>
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>}
            <IonList className="ion-no-padding">
                {employees.map(emp => (
                    <ConfigurationEmployeesElement workDayIsClosed={Boolean(workDay)} employees={employees} setEditEmployeeModal={setEditEmployeeModal} setSelectedEmployee={setSelectedEmployee} initialFetch={initialFetch} setLoading={setLoading} presentToast={presentToast} presentAlert={presentAlert} key={emp.employee_name} name={emp.employee_name} isPrivileged={emp.employee_privileged} />
                ))}
            </IonList>
            <IonModal onIonModalWillDismiss={async () => { await initialFetch(); setNewEmployeeModal(false) }} isOpen={newEmployeeModal}>
                <ConfigurationEmployeesNew setModal={setNewEmployeeModal} />
            </IonModal>
            <IonModal onIonModalWillDismiss={async () => { await initialFetch(); setSelectedEmployee({ name: null, isPrivileged: null }); setEditEmployeeModal(false) }} isOpen={editEmployeeModal}>
                <ConfigurationEmployeesEdit isPrivileged={selectedEmployee.isPrivileged} name={selectedEmployee.name} setModal={setEditEmployeeModal} />
            </IonModal>
        </LayoutPage>
    )
};

interface ConfigurationEmployeesElementProps {
    name: string,
    isPrivileged: boolean,
    presentAlert: any,
    presentToast: any,
    setLoading: any,
    initialFetch: any,
    setEditEmployeeModal: any,
    setSelectedEmployee: any,
    employees: any,
    workDayIsClosed: boolean,

};

const ConfigurationEmployeesElement: React.FC<ConfigurationEmployeesElementProps> = (props) => {



    const handleDelete = async () => {
        try {
            props.setLoading(true);
            await employeeController.deleteEmployeeByName(props.name);
            await props.presentToast({
                message: "Empleado eliminado con éxito",
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
            message: `Estás a punto de eliminar al empleado ${props.name}. ¿Confirmar?`,
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
            <IonGrid color="primary">
                <IonRow className="ion-align-items-center">
                    <IonText color="primary">
                        <h5 className="ion-no-margin">{props.name}</h5>
                    </IonText>
                    {props.isPrivileged ? <IonChip color="success">
                        <IonLabel>Privilegiado</IonLabel>
                    </IonChip> : null}
                </IonRow>
            </IonGrid>
            <IonButton disabled={props.workDayIsClosed} onClick={() => { props.setSelectedEmployee({ name: props.name, isPrivileged: props.isPrivileged }); props.setEditEmployeeModal(true); }} size="small" color="primary" fill="solid">
                <IonIcon icon={pencilOutline} />
            </IonButton>
            {props.employees.length > 1 && <IonButton disabled={props.workDayIsClosed} onClick={onDeleteClick} size="small" color="primary" fill="solid">
                <IonIcon icon={trashOutline} />
            </IonButton>}
        </IonItem>
    )
};

export default ConfigurationEmployees;