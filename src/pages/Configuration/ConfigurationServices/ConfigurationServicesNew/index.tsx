import ServiceTypeForm from "../../../../components/ServiceTypeForm";
import { useState } from "react";
import { ServiceTypeData } from "../../../../utils/interfaces";
import { useIonAlert, useIonToast } from "@ionic/react";
import { ServiceTypeController } from "../../../../controllers";
import { useHistory } from "react-router";

interface ConfigurationServicesNewProps {
    setModal: any,
};

const serviceTypeController: ServiceTypeController = new ServiceTypeController();

const ConfigurationServicesNew: React.FC<ConfigurationServicesNewProps> = (props) => {

    const history = useHistory();
    const [presentAlert] = useIonAlert();
    const [presentToast] = useIonToast();
    const [serviceTypeData, setServiceTypeData] = useState<ServiceTypeData>({
        name: { isValid: false, isTouched: false, value: "" },
        price: { isValid: false, isTouched: false, value: null },
    });

    const onAcceptClick = async () => {
        try {
            await serviceTypeController.createServiceType(serviceTypeData.name.value, (serviceTypeData.price.value ?? 0));
            await presentToast({
                message: "Tipo de Servicio creado con éxito",
                duration: 1500,
                position: "top",
                color: "success",
            });
            await presentAlert({
                header: "Atención",
                backdropDismiss: false,
                message: `Modificá los cobros para cada uno de los empleados para este tipo de servicio Vehículo ${serviceTypeData.name.value}`,
                buttons: [{
                    text: "Ok",
                    role:"confirmation",
                    handler: () => history.replace("/configuration/employees"),

                }],
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
        <ServiceTypeForm onAcceptClick={onAcceptClick} setServiceTypeData={setServiceTypeData} serviceTypeData={serviceTypeData} title="Nuevo Tipo de Servicio" setModal={props.setModal} />
    )
};

export default ConfigurationServicesNew;