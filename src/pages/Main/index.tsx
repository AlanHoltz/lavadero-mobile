import { useState, useEffect } from 'react';
import './Main.css';
import LayoutPage from '../../components/LayoutPage';
import { useIonAlert, IonGrid, IonRow, IonCol, IonList, IonItem, IonButton, IonIcon, IonLabel, IonText, IonModal, useIonViewWillEnter } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { EmployeeEarningsController, ServiceController, WorkDayEarningsByServiceTypesController } from '../../controllers';
import { formatDate, formatNumber } from '../../utils/general';
import { sqlite } from '../../App';
import { App } from '@capacitor/app';
import MainNewService from './MainNewService';
import MainDetail from './MainDetail';
import { WorkDaysController } from '../../controllers';

const workDaysController: WorkDaysController = new WorkDaysController();
const serviceController: ServiceController = new ServiceController();

const Main: React.FC = () => {

  useEffect(() => {
    App.addListener("backButton", () => { if (history.location.pathname === "/main") App.exitApp() });
    return () => { App.removeAllListeners() };
  }, []);

  const initialFetch = async () => {
    try {
      setLoading(true);
      const dbExists = (await sqlite.isDatabase("Lavadero")).result;
      if (!dbExists) return;
      const db = await sqlite.createConnection("Lavadero");
      await db.open();
      const fetchedServices = await serviceController.getServicesByDate(new Date(), "datetime", db);
      const wD = await workDaysController.getWorkDay(new Date(), db);
      setWorkDay(wD ? { ...wD } : null);
      setServices([...fetchedServices]);
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

  useIonViewWillEnter(() => {
    (async function () {
      await initialFetch();
    })()
  }, []);


  const [presentAlert] = useIonAlert();
  const [services, setServices] = useState<any[]>([]);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [newServiceModal, setNewServiceModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [workDay, setWorkDay] = useState<any>(null);


  return (
    <LayoutPage noPaddingContent toolbar={
      <IonGrid>
        <IonRow className="ion-justify-content-between ion-align-items-center">
          <IonCol size='auto'>
            <IonLabel color="secondary">
              <h1>
                {`${formatDate(new Date(), "%ds %D/%M")}`}
              </h1>
            </IonLabel>
          </IonCol>
          <IonCol size='auto'>
            {!workDay && <IonButton shape='round' onClick={(e) => setNewServiceModal(true)} color="secondary" fill='solid'>
              <IonIcon slot='start' icon={addOutline} />
              Nuevo
            </IonButton>}
          </IonCol>
        </IonRow>
      </IonGrid>
    } showLoading={loading} footer={<MainStats presentAlert={presentAlert} setDetailModal={setDetailModal} services={services} loading={loading} />}>
      <IonList className="ion-no-padding">
        {services.length > 0 && !loading && services?.map(service => <MainServiceItem history={history} name={service.service_name} datetime={service.service_datetime} value={service.service_special_price ?? service.service_type_price} key={service.service_datetime} />)}
      </IonList>
      {services.length === 0 && !loading && <IonText className="ion-text-center" color="primary" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
        <p>
          NO HAY SERVICIOS A LA FECHA
        </p>
      </IonText>}
      <IonModal onIonModalWillDismiss={async () => { setNewServiceModal(false); await initialFetch() }} isOpen={newServiceModal}>
        <MainNewService setNewServiceModal={setNewServiceModal} />
      </IonModal>
      <IonModal onIonModalWillDismiss={async () => { setDetailModal(false); await initialFetch() }} isOpen={detailModal}>
        <MainDetail setDetailModal={setDetailModal} />
      </IonModal>
    </LayoutPage >
  );
};

interface MainServiceItemProps {
  name: string,
  value: number,
  datetime: string,
  history: any,
};

const MainServiceItem: React.FC<MainServiceItemProps> = (props) => {

  return (
    <IonItem lines='full' onClick={() => props.history.push(`/main/service?name=${props.name}&datetime=${props.datetime}`)} button detail>
      <IonLabel color="primary">
        <h2 style={{ fontWeight: 500 }}>
          {props.name}
        </h2>
        <IonText>
          <p>${formatNumber(props.value)}</p>
        </IonText>
      </IonLabel>
    </IonItem>
  );
};

interface MainStatsProps {
  loading: boolean,
  services: any[],
  setDetailModal: any,
  presentAlert: any,
}
;
const MainStats: React.FC<MainStatsProps> = (props) => {

  const calculateTotal = () => {
    let totalValue = 0;
    props.services.forEach(service => {
      if (service.service_special_price) totalValue += service.service_special_price;
      else totalValue += service.service_type_price;
    });
    return totalValue;
  };

  return (
    <IonGrid>
      <IonRow className="ion-align-items-center ion-nowrap ion-justify-content-between">
        <IonCol size='auto'>
          <IonRow>
            <IonCol>
              <IonText color="primary" >
                <h3 className="ion-no-margin">TOTAL: <span>{props.loading ? '-' : `$${formatNumber(calculateTotal())}`}</span></h3>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText color="primary">
                <p className="ion-no-margin">CANTIDAD DE SERVICIOS: {props.services.length} </p>
              </IonText>
            </IonCol>
          </IonRow>
        </IonCol>
        <IonCol size='auto'>
          <IonButton onClick={async () => {
            if (props.services.length > 0) props.setDetailModal(true);
            else {
              await props.presentAlert({
                header: "Advertencia",
                message: "Aún no has realizado ningún servicio el día de hoy",
                buttons: ["OK"],
              });
            }
          }} shape="round" size='small' fill="solid">Ir a Detalles</IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  )
};


export default Main;
