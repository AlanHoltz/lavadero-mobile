import './History.css';
import LayoutPage from '../../components/LayoutPage';
import { IonButton, IonDatetime, IonText, IonModal, useIonViewWillEnter, useIonAlert } from '@ionic/react';
import { useEffect, useState } from 'react';
import { formatDate } from '../../utils/general';
import HistoryDay from './HistoryDay';
import { WorkDaysController } from '../../controllers';
import { sqlite } from '../../App';


const workDaysController: WorkDaysController = new WorkDaysController();

const History: React.FC = () => {

  const [historyModal, setHistoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [presentAlert] = useIonAlert();
  const [dateRange, setDateRange] = useState<{ range_min: string, range_max: string }>();
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [workDay, setWorkDay] = useState();

  const initialFetch = async () => {
    try {
      setLoading(true);
      const db = await sqlite.createConnection("Lavadero");
      await db.open();
      setWorkDay(await workDaysController.getWorkDay(new Date(), db));
      setDateRange(await workDaysController.getWorkDaysRange(db));
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

  useEffect(() => {
    if (dateRange?.range_max) setSelectedDate(dateRange.range_max);
  }, [dateRange]);

  return (
    <LayoutPage showLoading={loading}>
      <IonText color="primary">
        <h2 className="ion-no-margin ion-margin-bottom">Historial de Trabajo</h2>
      </IonText>
      <IonDatetime
        min={dateRange?.range_min ?? formatDate(new Date(), "%Y-%M-%D")}
        max={dateRange?.range_max ?? formatDate(new Date(), "%Y-%M-%D")}
        isDateEnabled={(d) => {
          if (!workDay && d === formatDate(new Date(), "%Y-%M-%D")) return false;
          const dayOfTheWeek = new Date(d).getDay();
          return dayOfTheWeek !== 6;
        }} value={selectedDate} onIonChange={(e) => setSelectedDate(e.target.value?.toString() ?? "")} presentation='date' size="cover" showDefaultTimeLabel={false} color="primary"></IonDatetime>
      <IonButton disabled={selectedDate === null} onClick={() => setHistoryModal(true)} expand='full'>
        Aceptar
      </IonButton>
      <IonModal onIonModalWillDismiss={async () => { setHistoryModal(false); }} isOpen={historyModal}>
        <HistoryDay setModal={setHistoryModal} date={selectedDate ?? ""} />
      </IonModal>
    </LayoutPage>
  );
};

export default History;