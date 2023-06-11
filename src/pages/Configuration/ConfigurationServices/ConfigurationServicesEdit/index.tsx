import ServiceTypeForm from "../../../../components/ServiceTypeForm";
import { useState } from "react";
import { ServiceTypeData } from "../../../../utils/interfaces";
import { useIonAlert, useIonToast } from "@ionic/react";
import { ServiceTypeController } from "../../../../controllers";

interface ConfigurationServicesEditProps {
    setModal: any,
    selectedService: { name: string | null, price: number | null },
};

const serviceTypeController: ServiceTypeController = new ServiceTypeController();

const ConfigurationServicesEdit: React.FC<ConfigurationServicesEditProps> = (props) => {

    const [presentAlert] = useIonAlert();
    const [presentToast] = useIonToast();
    const [serviceTypeData, setServiceTypeData] = useState<ServiceTypeData>({
        name: { isValid: true, isTouched: false, value: props.selectedService.name ?? "" },
        price: { isValid: true, isTouched: false, value: props.selectedService.price ?? 0 },
    });

    const originalSTName: string = props.selectedService.name ?? "";

    const onAcceptClick = async () => {
        try {
            await serviceTypeController.updateServiceType(originalSTName, { name: serviceTypeData.name.value, price: serviceTypeData.price.value ?? 0 });
            await presentToast({
                message: "Tipo de Servicio editado con éxito",
                duration: 1500,
                position: "top",
                color: "success",
            });
            props.setModal(false);
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
        <ServiceTypeForm onAcceptClick={onAcceptClick} setServiceTypeData={setServiceTypeData} serviceTypeData={serviceTypeData} title="Editar Tipo de Servicio" setModal={props.setModal} />
    )
};

export default ConfigurationServicesEdit;