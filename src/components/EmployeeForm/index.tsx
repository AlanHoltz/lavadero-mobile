import LayoutPage from "../LayoutPage";
import { IonItem, IonLabel, IonInput, IonNote, IonButton, IonToggle, IonText, IonSegment, IonSegmentButton } from "@ionic/react";
import { useState} from "react";
import { EmployeeData } from "../../utils/interfaces";
import PriceInput from "../PriceInput";
import { deepClone } from "../../utils/general";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';

interface EmployeeFormProps {
    setModal: any,
    formTitle: string,
    employeeData: EmployeeData,
    setEmployeeData: any,
    onAcceptInformationClick: any,
    allowSetEarnings?: boolean,
    setSwiper: any,
    swiper: any,
    onAcceptEarningsClick: any,
};



const EmployeeForm: React.FC<EmployeeFormProps> = (props) => {


    const [loading, setLoading] = useState(false);
    const [segment, setSegment] = useState("information");


    return (
        <LayoutPage onBackButtonClick={() => {
            props.setModal(false);
        }} wrapIonPage={false} toolbar={
            <IonSegment onIonChange={(e) => e.target.value === "earnings" ? props.swiper.slideNext() : props.swiper.slidePrev()} value={segment}>
                <IonSegmentButton value="information">
                    Información
                </IonSegmentButton>
                <IonSegmentButton disabled={!props.allowSetEarnings} value="earnings">
                    Cobros
                </IonSegmentButton>
            </IonSegment>
        } showLoading={loading} title={props.formTitle} allowGoBack>
            <Swiper allowTouchMove={false} onSlidePrevTransitionStart={() => setSegment("information")} onSlideNextTransitionStart={() => setSegment("earnings")} onSwiper={(swiper) => props.setSwiper(swiper)} style={{ height: "100%" }}>
                <SwiperSlide>
                    <ServiceFormInformation onAcceptInformationClick={props.onAcceptInformationClick} setLoading={setLoading} setEmployeeData={props.setEmployeeData} employeeData={props.employeeData} />
                </SwiperSlide>
                <SwiperSlide>
                    <ServiceFormEarnings onAcceptEarningsClick={props.onAcceptEarningsClick} setLoading={setLoading} employeeData={props.employeeData} setEmployeeData={props.setEmployeeData} />
                </SwiperSlide>
            </Swiper>

        </LayoutPage >

    )
};

EmployeeForm.defaultProps = {
    allowSetEarnings: true,
}

interface ServiceFormInformationProps {
    employeeData: EmployeeData,
    setEmployeeData: any,
    setLoading: any,
    onAcceptInformationClick: any,
}

const ServiceFormInformation: React.FC<ServiceFormInformationProps> = (props) => {

    const onAcceptClick = async () => {
        props.setLoading(true);
        const emCpy = deepClone(props.employeeData);
        if (!emCpy.name.isTouched) emCpy.name.isTouched = true;
        props.setEmployeeData(deepClone(emCpy));
        if (emCpy.name.isValid) {
            await props.onAcceptInformationClick();
        };
        props.setLoading(false);
    };

    return (
        <>
            <IonItem className={`ion-margin-bottom ion-no-padding ${!props.employeeData.name.isValid && props.employeeData.name.isTouched ? "ion-invalid" : null}`}>
                <IonLabel color="primary" position="stacked">Nombre de Empleado</IonLabel>
                <IonInput
                    value={props.employeeData.name.value}
                    onIonBlur={(e) => {
                        const emCpy = deepClone(props.employeeData);
                        if (!emCpy.name.isTouched) emCpy.name.isTouched = true;
                        if (!(emCpy.name.value.length >= 3 && emCpy.name.value.length <= 20)) {
                            emCpy.name.isValid = false;
                        };
                        props.setEmployeeData(deepClone(emCpy));
                    }}
                    onIonInput={(e) => {
                        const emCpy = deepClone(props.employeeData);
                        if (!emCpy.name.isValid) { emCpy.name.isValid = true };
                        emCpy.name.value = e.target.value?.toString() ?? "";
                        props.setEmployeeData(deepClone(emCpy));
                    }}
                    color="primary"></IonInput>
                <IonNote slot="error">Entre 3 y 20 carácteres</IonNote>
            </IonItem>
            <IonItem className="ion-no-padding ion-margin-bottom">
                <IonLabel color="primary">
                    <IonText>
                        <p>
                            Empleado Privilegiado
                        </p>
                    </IonText>
                </IonLabel>
                <IonToggle onIonChange={(e) => props.setEmployeeData({ ...deepClone(props.employeeData), isPrivileged: !props.employeeData.isPrivileged })} checked={props.employeeData.isPrivileged} slot="end"></IonToggle>
            </IonItem>
            <IonButton onClick={onAcceptClick} expand='full'>Aceptar</IonButton>
        </>
    )
};

interface ServiceFormEarningsProps {
    employeeData: EmployeeData,
    setEmployeeData: any,
    setLoading: any,
    onAcceptEarningsClick: any,
};

const ServiceFormEarnings: React.FC<ServiceFormEarningsProps> = (props) => {


    const onAcceptClick = async () => {
        props.setLoading(true);
        const emCpy = deepClone(props.employeeData);
        emCpy.serviceTypes.forEach((sT: any) => { if (!sT.serviceEarnings.isTouched) { sT.serviceEarnings.isTouched = true } });
        props.setEmployeeData(deepClone(emCpy));
        if (emCpy.serviceTypes.every((sT: any) => sT.serviceEarnings.isValid)) await props.onAcceptEarningsClick();
        props.setLoading(false);
    };

    return (
        <>
            {props.employeeData.serviceTypes.map((eD, index) => (
                <PriceInput key={eD.serviceName} label={`Vehículo ${eD.serviceName}`} error={!eD.serviceEarnings.isValid && eD.serviceEarnings.isTouched ? "Monto mayor a 0" : null} onChange={(price: number) => {
                    const emCpy = deepClone(props.employeeData);
                    if (!eD.serviceEarnings.isValid) emCpy.serviceTypes[index].serviceEarnings.isValid = true;
                    emCpy.serviceTypes[index].serviceEarnings.value = price;
                    props.setEmployeeData(deepClone(emCpy));
                }} price={eD.serviceEarnings.value} onBlur={() => {
                    const emCpy = deepClone(props.employeeData);
                    if (!emCpy.serviceTypes[index].serviceEarnings.isTouched) emCpy.serviceTypes[index].serviceEarnings.isTouched = true;
                    if (emCpy.serviceTypes[index].serviceEarnings.value <= 0) {
                        emCpy.serviceTypes[index].serviceEarnings.isValid = false;
                    };
                    props.setEmployeeData(deepClone(emCpy));

                }} />
            ))}
            <IonButton onClick={onAcceptClick} expand='full'>Aceptar</IonButton>
        </>
    )
};

export default EmployeeForm;