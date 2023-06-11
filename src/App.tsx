import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Main from './pages/Main';
import History from './pages/History';
import Configuration from './pages/Configuration';
import ConfigurationServices from './pages/Configuration/ConfigurationServices';
import { SQLiteHook, useSQLite } from 'react-sqlite-hook';
import { todayOutline, searchCircleOutline, settingsOutline } from 'ionicons/icons';
import ConfigurationEmployees from './pages/Configuration/ConfigurationEmployees';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/*Global*/
import './global.css';
import { useEffect, useState } from 'react';
import { createDatabaseIfNotExists } from './models';
import MainServiceDetails from './pages/Main/MainServiceDetail';

setupIonicReact();

export let sqlite: SQLiteHook;

const App: React.FC = () => {

  sqlite = useSQLite();

  const [databaseisCreated, setDatabaseIsCreated] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        setDatabaseIsCreated(false);
        await createDatabaseIfNotExists();
        setDatabaseIsCreated(true);
      }
      catch (err: any) {
        console.log(err);
      };
    })()

  }, []);

  if (!databaseisCreated) return null;

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/">
              <Redirect to={"/main"} />
            </Route>
            <Route exact path="/main" render={() => <Main />} />
            <Route exact path="/main/service" render={() => <MainServiceDetails />} />
            <Route exact path="/history" render={() => <History />} />
            <Route exact path="/configuration" render={() => <Configuration />} />
            <Route exact path="/configuration/services" render={() => <ConfigurationServices />} />
            <Route exact path="/configuration/employees" render={() => <ConfigurationEmployees />} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="main" href="/main">
              <IonIcon icon={todayOutline} />
              <IonLabel>Hoy</IonLabel>
            </IonTabButton>
            <IonTabButton tab="history" href="/history">
              <IonIcon icon={searchCircleOutline} />
              <IonLabel>Historial</IonLabel>
            </IonTabButton>
            <IonTabButton tab="configuration" href="/configuration">
              <IonIcon icon={settingsOutline} />
              <IonLabel>Configuración</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
