import './Configuration.css';
import LayoutPage from '../../components/LayoutPage';
import { IonList, IonLabel, IonItem, IonIcon, useIonAlert, useIonToast, IonItemGroup, IonItemDivider } from '@ionic/react';
import { carSportOutline, personOutline, refreshOutline, cloudDownloadOutline, cloudUploadOutline } from 'ionicons/icons';
import { deleteDatabase, createDatabaseIfNotExists, importDatabase } from '../../models';
import { useHistory } from 'react-router';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { sqlite } from '../../App';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { useState } from 'react';

const Configuration: React.FC = () => {

    const [loading, setLoading] = useState(false);
    const [presentAlert] = useIonAlert();
    const [presentToast] = useIonToast();
    const history = useHistory();

    const resetDB = async () => {
        await deleteDatabase();
        await createDatabaseIfNotExists();
        await presentToast({
            message: "Sistema reestablecido de fábrica con éxito",
            duration: 1500,
            position: "top",
            color: "success",

        });
    };

    const onImportClick = async () => {
        try {
            const result = await FilePicker.pickFiles({
                multiple: false,
            });

            const filePath = result.files[0].path;

            if (!filePath) return;

            setLoading(true);

            const contents = await Filesystem.readFile({
                path: filePath ?? "",
                encoding: Encoding.UTF8,
            });

            await importDatabase(contents.data);

            await presentToast({
                message: "Base de Datos importada correctamente",
                duration: 1500,
                position: "top",
                color: "success",

            });
        }
        catch (err: any) {

        }
        finally {
            setLoading(false);
        };
    };

    const onExportClick = async () => {
        try {
            setLoading(true);
            const db = await sqlite.createConnection("Lavadero");
            await db.open();
            const exportedDB = await db.exportToJson("full");
            await Filesystem.writeFile({
                path: 'lavadero/db.json',
                data: JSON.stringify(exportedDB.export),
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
                recursive: true,
            });
            await presentToast({
                message: "Base de Datos exportada correctamente",
                duration: 1500,
                position: "top",
                color: "success",

            });
        } catch (err: any) {
            
        }
        finally {
            await sqlite.closeConnection("Lavadero");
            setLoading(false);
        };

    };

    return (
        <LayoutPage showLoading={loading} noPaddingContent>
            <IonList className="ion-no-padding ion-padding-bottom" lines="full">
                <IonItemGroup>
                    <IonItemDivider color="primary">
                        <IonLabel>
                            Configuración del Negocio
                        </IonLabel>
                    </IonItemDivider>
                    <IonItem onClick={() => history.push("/configuration/services")} detail button>
                        <IonIcon color='primary' slot='start' icon={carSportOutline} />
                        <IonLabel color="primary">
                            <h3 style={{ fontWeight: "bold" }}>
                                Configurar Servicios
                            </h3>
                            <p>Precio de Servicios</p>
                        </IonLabel>
                    </IonItem>

                    <IonItem onClick={() => history.push("/configuration/employees")} detail button>
                        <IonIcon color='primary' slot='start' icon={personOutline} />
                        <IonLabel color="primary">
                            <h3 style={{ fontWeight: "bold" }}>
                                Configurar Empleados
                            </h3>
                            <p>Información, Cobros</p>
                        </IonLabel>
                    </IonItem>

                </IonItemGroup>
                <IonItemGroup>
                    <IonItemDivider color="primary">
                        <IonLabel>
                            Configuración de la Base de Datos
                        </IonLabel>
                    </IonItemDivider>
                    <IonItem onClick={onImportClick} button>
                        <IonIcon color='primary' slot='start' icon={cloudUploadOutline} />
                        <IonLabel color="primary">
                            <h3 style={{ fontWeight: "bold" }}>
                                Importar
                            </h3>
                            <p>Importar DB</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem onClick={onExportClick} button>
                        <IonIcon color='primary' slot='start' icon={cloudDownloadOutline} />
                        <IonLabel color="primary">
                            <h3 style={{ fontWeight: "bold" }}>
                                Exportar
                            </h3>
                            <p>Descargar DB</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem onClick={async () => await presentAlert({
                        header: "Reestablecer",
                        message: "Estás por reiniciar el sistema de fábrica. ¿Confirmar?",
                        buttons: [
                            {
                                text: "Cancelar",
                                role: "cancel"
                            },
                            {
                                text: "Confirmar",
                                role: "confirm",
                                handler: resetDB,
                            }
                        ]
                    })} button>
                        <IonIcon color='primary' slot='start' icon={refreshOutline} />
                        <IonLabel color="primary">
                            <h3 style={{ fontWeight: "bold" }}>
                                Reestablecer
                            </h3>
                            <p>Reiniciar DB</p>
                        </IonLabel>
                    </IonItem>
                </IonItemGroup>
            </IonList>
        </LayoutPage>
    )
};

export default Configuration;