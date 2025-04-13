import { useIonAlert, useIonToast } from "@ionic/react";
import { useState } from "react";
import { ServiceController } from "../../../../controllers";
import { ServiceData } from "../../../../utils/interfaces";
import ServiceForm from "../../../../components/ServiceForm";

interface MainServiceDetailEditProps {
    setEditServiceModal: any,
    currentService: any,
};

const serviceController: ServiceController = new ServiceController();

const MainServiceDetailEdit: React.FC<MainServiceDetailEditProps> = (props) => {

    const [presentAlert] = useIonAlert();
    const [presentToast] = useIonToast();


    const isSpecialService = Boolean(props.currentService.service_special_price);
    const originalServiceName = props.currentService.service_name;
    const [serviceData, setServiceData] = useState<ServiceData>({
        serviceName: { isValid: true, isTouched: false, value: props.currentService.service_name },
        serviceType: props.currentService.service_type_name,
        clientPhone: { isValid: true, isTouched: false, value: props.currentService.service_client_phone ?? "" },
        finalPrice: { isValid: true, isTouched: false, value: isSpecialService ? props.currentService.service_special_price : null },
        isSpecial: isSpecialService,
        serviceMadeBy: props.currentService.service_made_by

    });

    const onEditClickButton = async () => {

        try {
            await serviceController.updateService(originalServiceName, props.currentService.service_datetime, serviceData);
            await presentToast({
                message: "Servicio editado con éxito",
                duration: 1500,
                position: "top",
                color: "success",

            });
            props.setEditServiceModal(false);
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
        <ServiceForm formTitle="Editar Servicio" onAcceptClick={onEditClickButton} serviceData={serviceData} setServiceData={setServiceData} setModal={props.setEditServiceModal} />
    )
};

export default MainServiceDetailEdit;