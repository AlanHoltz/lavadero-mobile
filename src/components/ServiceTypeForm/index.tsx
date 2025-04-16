import LayoutPage from "../LayoutPage"
import { useState } from "react"
import { ServiceTypeData } from "../../utils/interfaces";
import { IonButton, IonInput, IonItem, IonLabel, IonNote } from "@ionic/react";
import PriceInput from "../PriceInput";
import { deepClone } from "../../utils/general";
import './ServiceTypeForm.css';

interface ServiceTypeFormProps {
    title: string,
    setModal: any,
    serviceTypeData: ServiceTypeData,
    setServiceTypeData: any,
    onAcceptClick: any,

}

const ServiceTypeForm: React.FC<ServiceTypeFormProps> = (props) => {

    const [loading, setLoading] = useState(false);

    const onAcceptClick = async () => {
        setLoading(true);
        const sTDCpy = deepClone(props.serviceTypeData);
        if (!sTDCpy.name.isTouched) sTDCpy.name.isTouched = true;
        if (!sTDCpy.price.isTouched) sTDCpy.price.isTouched = true;
        props.setServiceTypeData(deepClone(sTDCpy));
        if (sTDCpy.name.isValid && sTDCpy.price.isValid) {
            await props.onAcceptClick();
        };
        setLoading(false);
    };

    return (
        <LayoutPage allowGoBack
            onBackButtonClick={() => props.setModal(false)}
            showLoading={loading}
            wrapIonPage={false}
            title={props.title}>
            <IonItem className={`ion-margin-bottom ion-no-padding ${!props.serviceTypeData.name.isValid && props.serviceTypeData.name.isTouched && "ion-invalid"}`}>
                <IonLabel color="primary" position="stacked">Nombre de Tipo de Servicio</IonLabel>
                <IonInput
                    className="service-type-input"
                    value={props.serviceTypeData.name.value}
                    onIonBlur={(e) => {
                        const sTDCpy = deepClone(props.serviceTypeData);
                        if (!sTDCpy.name.isTouched) sTDCpy.name.isTouched = true;
                        if (!(sTDCpy.name.value.length >= 3 && sTDCpy.name.value.length <= 20)) {
                            sTDCpy.name.isValid = false;
                        };
                        props.setServiceTypeData(deepClone(sTDCpy));
                    }}
                    onIonInput={(e) => {
                        const sTDCpy = deepClone(props.serviceTypeData);
                        if (!sTDCpy.name.isValid) { sTDCpy.name.isValid = true };
                        sTDCpy.name.value = e.target.value?.toString() ?? "";
                        props.setServiceTypeData(deepClone(sTDCpy));
                    }}
                    color="primary"></IonInput>
                <IonNote slot="error">Entre 3 y 20 carácteres</IonNote>
            </IonItem>
            <PriceInput label="Precio de Tipo de Servicio" error={!props.serviceTypeData.price.isValid && props.serviceTypeData.price.isTouched ? "Monto mayor a 0" : null} onChange={(price: number) => {
                const sTDCpy = deepClone(props.serviceTypeData);
                if (!sTDCpy.price.isValid) sTDCpy.price.isValid = true;
                sTDCpy.price.value = price;
                props.setServiceTypeData(deepClone(sTDCpy));
            }} price={props.serviceTypeData.price.value} onBlur={() => {
                const sTDCpy = deepClone(props.serviceTypeData);
                if (!sTDCpy.price.isTouched) sTDCpy.price.isTouched = true;
                if (sTDCpy.price.value === null || sTDCpy.price.value <= 0) {
                    sTDCpy.price.isValid = false;
                };
                props.setServiceTypeData(deepClone(sTDCpy));

            }} />
            <IonButton onClick={onAcceptClick} expand='full'>Aceptar</IonButton>
        </LayoutPage>
    )
};

export default ServiceTypeForm;
