import LayoutPage from "../LayoutPage";
import { IonItem, IonLabel, useIonAlert, IonInput, IonNote, IonCheckbox, IonSelect, IonButton, IonSelectOption } from "@ionic/react";
import { useState, useEffect } from "react";
import { EmployeeController, ServiceTypeController } from "../../controllers";
import { sqlite } from "../../App";
import { ServiceData } from "../../utils/interfaces";
import PriceInput from "../PriceInput";
import { deepClone } from "../../utils/general";

interface ServiceFormProps {
    serviceData: ServiceData,
    setServiceData: any,
    setModal: any,
    onAcceptClick: any,
    formTitle: string,
};

const serviceTypeController: ServiceTypeController = new ServiceTypeController();
const employeeController: EmployeeController = new EmployeeController();

const ServiceForm: React.FC<ServiceFormProps> = (props) => {

    useEffect(() => {
        (async function () {
            try {
                setLoading(true);
                const db = await sqlite.createConnection("Lavadero");
                await db.open();
                const serviceTypesRes = await serviceTypeController.getServiceTypes(db);
                setServiceTypes([...serviceTypesRes]);
                const employeesRes = await employeeController.getEmployees(db);
                setEmployees([...employeesRes]);
                if (employeesRes.length < 2) props.setServiceData(deepClone({ ...props.serviceData, serviceMadeBy: employeesRes[0]?.employee_name }))
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
        }
        )();
    }, []);


    const [presentAlert] = useIonAlert();
    const [loading, setLoading] = useState(false);
    const [serviceTypes, setServiceTypes] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);

    const onAcceptClick = async () => {
        setLoading(true);
        const sDCpy = deepClone(props.serviceData);
        if (!sDCpy.serviceName.isTouched) sDCpy.serviceName.isTouched = true;
        if (!sDCpy.clientPhone.isTouched) sDCpy.clientPhone.isTouched = true;
        if (!sDCpy.finalPrice.isTouched) sDCpy.finalPrice.isTouched = true;
        props.setServiceData(deepClone(sDCpy));
        if (sDCpy.serviceName.isValid && sDCpy.clientPhone.isValid && (!sDCpy.isSpecial || sDCpy.isSpecial && sDCpy.finalPrice.isValid)) {
            await props.onAcceptClick();
        };
        setLoading(false);
    };



    return (
        <LayoutPage onBackButtonClick={() => {
            props.setModal(false);
        }} wrapIonPage={false} showLoading={loading} title={props.formTitle} allowGoBack>
            <IonItem className={`ion-margin-bottom ion-no-padding ${!props.serviceData.serviceName.isValid && props.serviceData.serviceName.isTouched && "ion-invalid"}`}>
                <IonLabel color="primary" position="stacked">Nombre de Servicio</IonLabel>
                <IonInput
                    value={props.serviceData.serviceName.value}
                    onIonBlur={(e) => {
                        const sDCpy = deepClone(props.serviceData);
                        if (!sDCpy.serviceName.isTouched) sDCpy.serviceName.isTouched = true;
                        if (!(sDCpy.serviceName.value.length >= 3 && sDCpy.serviceName.value.length <= 20)) {
                            sDCpy.serviceName.isValid = false;
                        };
                        props.setServiceData(deepClone(sDCpy));
                    }}
                    onIonInput={(e) => {
                        const sDCpy = deepClone(props.serviceData);
                        if (!sDCpy.serviceName.isValid) { sDCpy.serviceName.isValid = true };
                        sDCpy.serviceName.value = e.target.value?.toString() ?? "";
                        props.setServiceData(deepClone(sDCpy));
                    }}
                    color="primary"></IonInput>
                <IonNote slot="error">Entre 3 y 20 carácteres</IonNote>
            </IonItem>
            <IonItem className={`ion-margin-bottom ion-no-padding ${!props.serviceData.clientPhone.isValid && props.serviceData.clientPhone.isTouched && "ion-invalid"}`}>
                <IonLabel color="primary" position="stacked">Teléfono (opcional)</IonLabel>
                <IonInput
                    value={props.serviceData.clientPhone.value}
                    onIonBlur={(e) => {
                        const sDCpy = deepClone(props.serviceData);
                        if (!sDCpy.clientPhone.isTouched) {
                            sDCpy.clientPhone.isTouched = true;
                        };
                        const phoneLength = sDCpy.clientPhone.value.length;
                        if (phoneLength !== 0 && !(phoneLength >= 10 && phoneLength <= 20)) {
                            sDCpy.clientPhone.isValid = false;
                        };
                        props.setServiceData(deepClone(sDCpy));
                    }}
                    onIonInput={(e) => {
                        const sDCpy = deepClone(props.serviceData);
                        if (!sDCpy.clientPhone.isValid) { sDCpy.clientPhone.isValid = true };
                        sDCpy.clientPhone.value = e.target.value?.toString() ?? "";
                        props.setServiceData(deepClone(sDCpy));
                    }}
                    inputMode='numeric' color="primary"></IonInput>
                <IonNote slot='error'>Entre 10 y 20 carácteres numéricos</IonNote>
            </IonItem>
            <IonItem className="ion-margin-bottom ion-no-padding">
                <IonLabel color="primary" position="stacked">Tipo de Servicio</IonLabel>
                <IonSelect onIonChange={(e) => props.setServiceData({ ...deepClone(props.serviceData), serviceType: e.target.value })} value={props.serviceData.serviceType} interface="alert">
                    {serviceTypes.map(sT => (<IonSelectOption key={sT.service_type_name} value={sT.service_type_name}>{sT.service_type_name} ({`$${sT.service_type_price}`})</IonSelectOption>))}
                </IonSelect>
            </IonItem>
            <IonItem className="ion-margin-bottom ion-no-padding">
                <IonLabel color="primary" position="stacked">Servicio Realizado por</IonLabel>
                <IonSelect onIonChange={(e) => props.setServiceData({ ...deepClone(props.serviceData), serviceMadeBy: e.target.value })} value={employees.length > 1 ? props.serviceData.serviceMadeBy : employees[0]?.employee_name} interface="alert">
                    {employees.length > 1 && <IonSelectOption value={null}>Todos los empleados</IonSelectOption>}
                    {employees.map(em => (<IonSelectOption key={em.employee_name} value={em.employee_name}>{em.employee_name}</IonSelectOption>))}
                </IonSelect>
            </IonItem>
            <IonItem className="ion-margin-bottom ion-no-padding">
                <IonCheckbox checked={props.serviceData.isSpecial} value={props.serviceData.isSpecial} onIonChange={(e) => {
                    const sDCpy = deepClone(props.serviceData);
                    sDCpy.isSpecial = !sDCpy.isSpecial;
                    sDCpy.finalPrice.value = null;
                    sDCpy.finalPrice.isTouched = false;
                    sDCpy.finalPrice.isValid = false;
                    props.setServiceData(deepClone(sDCpy));
                }} color="primary" slot="end" />
                <IonLabel color="primary">Servicio Especial</IonLabel>
            </IonItem>
            {props.serviceData.isSpecial && <PriceInput label="Precio Final" error={!props.serviceData.finalPrice.isValid && props.serviceData.finalPrice.isTouched ? "Monto mayor a 0" : null} onChange={(price: number) => {
                const sDCpy = deepClone(props.serviceData);
                if (!sDCpy.finalPrice.isValid) sDCpy.finalPrice.isValid = true;
                sDCpy.finalPrice.value = price;
                props.setServiceData(deepClone(sDCpy));
            }} price={props.serviceData.finalPrice.value} onBlur={() => {
                const sDCpy = deepClone(props.serviceData);
                if (!sDCpy.finalPrice.isTouched) sDCpy.finalPrice.isTouched = true;
                if (sDCpy.finalPrice.value === null || sDCpy.finalPrice.value <= 0) {
                    sDCpy.finalPrice.isValid = false;
                };
                props.setServiceData(deepClone(sDCpy));

            }} />}
            <IonButton onClick={onAcceptClick} expand='full'>Aceptar</IonButton>
        </LayoutPage >

    )
};


export default ServiceForm;