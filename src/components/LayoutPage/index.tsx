import './LayoutPage.css';
import { IonLoading, IonPage, IonButtons, IonFooter, IonBackButton, IonHeader, IonToolbar, IonContent, IonTitle, IonButton, IonIcon } from '@ionic/react';
import { ReactNode } from 'react';
import { arrowBack } from 'ionicons/icons';


interface LayoutPageProps {
    children: ReactNode,
    allowGoBack?: boolean,
    footer?: ReactNode,
    showLoading?: boolean,
    title?: string,
    wrapIonPage?: boolean,
    onBackButtonClick?: any,
    noPaddingContent?: boolean,
    toolbar?: ReactNode,
};


const LayoutPage: React.FC<LayoutPageProps> = (props) => {

    const MainContent: JSX.Element = (
        <>
            <IonHeader>
                <IonToolbar color="primary">
                    {props.allowGoBack && <IonButtons slot='start'>
                        {props.onBackButtonClick ?
                            <IonButton onClick={props.onBackButtonClick}>
                                <IonIcon style={{ fontSize: "24px" }} icon={arrowBack} />
                            </IonButton>
                            :
                            <IonBackButton defaultHref='#' />
                        }

                    </IonButtons>}
                    <IonTitle style={{paddingLeft:"10px"}} className={`ion-no-padding ${!props.title ? "lavadero_title" : ""}`}>
                        {props.title ?? "Lavadero Ave Fénix"}
                    </IonTitle>
                </IonToolbar>
                {props.toolbar && <IonToolbar color="primary">
                    {props.toolbar}
                </IonToolbar>}
            </IonHeader>
            <IonContent className={props.noPaddingContent ? "ion-no-padding" : "ion-padding"}>
                <IonLoading isOpen={props.showLoading ?? false} />
                {props.children}
            </IonContent>
            {props.footer && <IonFooter>
                <IonToolbar>
                    {props.footer}
                </IonToolbar>
            </IonFooter>}
        </>
    )

    if (props.wrapIonPage) return <IonPage>{MainContent}</IonPage>
    return MainContent;
};

LayoutPage.defaultProps = {
    wrapIonPage: true,
};

export default LayoutPage;