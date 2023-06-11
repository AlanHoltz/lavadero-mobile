import { IonGrid, IonCol, IonRow, IonText, IonItemDivider } from "@ionic/react";
import { formatNumber } from "../../utils/general";

interface PricingProps {
    subtotal?: number,
    children?: any,
    total?: number,

}

const Pricing: React.FC<PricingProps> = (props) => {
    return (
        <IonGrid>
            {props.subtotal && <IonRow className="ion-justify-content-between">
                <IonCol size="auto">
                    <IonText color="primary">
                        SUBTOTAL
                    </IonText>
                </IonCol>
                <IonCol size="auto">
                    <IonText color="primary">
                        ${formatNumber(props.subtotal)}
                    </IonText>
                </IonCol>
            </IonRow>}
            {props.subtotal && <IonRow>
                <IonCol>
                    <IonItemDivider style={{ minHeight: 0 }} />
                </IonCol>
            </IonRow>}
            {props.children}
            {props.total && <IonRow>
                <IonCol>
                    <IonItemDivider style={{ minHeight: 0 }} />
                </IonCol>
            </IonRow>}
            {props.total && <IonRow className="ion-justify-content-between">
                <IonCol className="ion-align-self-center" size="auto">
                    <IonText className="ion-align-self-center" color="primary">
                        <p style={{ fontSize: "18px" }}>
                            TOTAL
                        </p>
                    </IonText>
                </IonCol>
                <IonCol size="auto">
                    <IonText color="primary">
                        <h3 className="ion-no-margin" style={{ fontWeight: "bold", fontSize: "18px" }}>
                            {`$${formatNumber(props.total)}`}
                        </h3>
                    </IonText>
                </IonCol>
            </IonRow>}
        </IonGrid>
    )
};

interface PricingElementProps {
    name: string,
    price: number,
    isSpent?: boolean,
    clarification?: number | null,
};

const PricingElement: React.FC<PricingElementProps> = (props) => {
    return (
        <IonRow className="ion-justify-content-between">
            <IonCol size="auto">
                <IonText color="primary">
                    {props.name}
                </IonText>
            </IonCol>
            <IonCol size="auto">
                <IonText color={props.isSpent ? "danger" : "primary"}>
                    {`${props.isSpent ? "-" : ""}$${formatNumber(props.price)}${props.clarification ? `($${formatNumber(props.clarification)})` : ""}`}
                </IonText>
            </IonCol>
        </IonRow>
    )
};

export default Pricing;
export { PricingElement };