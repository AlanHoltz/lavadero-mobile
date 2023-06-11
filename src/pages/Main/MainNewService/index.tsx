import './MainNewService.css';
import { useIonToast, useIonAlert } from '@ionic/react';
import { useState } from 'react';
import { ServiceController } from '../../../controllers';
import { ServiceData } from '../../../utils/interfaces';
import ServiceForm from '../../../components/ServiceForm';

interface MainNewServiceProps {
    setNewServiceModal: any,
};

const serviceController: ServiceController = new ServiceController();

const MainNewService: React.FC<MainNewServiceProps> = (props) => {

    const [presentAlert] = useIonAlert();
    const [presentToast] = useIonToast();

    const [serviceData, setServiceData] = useState<ServiceData>({
        serviceName: { isValid: false, isTouched: false, value: "" },
        serviceType: "Pequeño",
        clientPhone: { isValid: true, isTouched: false, value: "" },
        finalPrice: { isValid: false, isTouched: false, value: null },
        isSpecial: false,
        serviceMadeBy: null,
    });

    const onButtonCreateServiceClick = async () => {
        try {
            await serviceController.createService(serviceData);
            await presentToast({
                message: "Servicio creado con éxito",
                duration: 1500,
                position: "top",
                color: "success",

            });
            props.setNewServiceModal(false);
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
        <ServiceForm formTitle="Nuevo Servicio" setModal={props.setNewServiceModal} onAcceptClick={onButtonCreateServiceClick} serviceData={serviceData} setServiceData={setServiceData} />
    );
};

export default MainNewService;