import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText } from "@ionic/react";
import { formatNumber } from "../../utils/general";
import { GlobalStats } from "../../utils/interfaces";
import Pricing, { PricingElement } from "../Pricing";

interface WorkDayDetailsProps {
    globalStats: GlobalStats,
    boxClosedOn: { value: number | null, isTouched: boolean, isValid: boolean },
    employeeEarnings?: any,
    showClarification?: boolean,
}

const WorkDayDetails: React.FC<WorkDayDetailsProps> = (props) => {


    return (
        <>
            <IonCard className="ion-margin-bottom ion-padding">
                <IonCardHeader className="ion-no-padding ion-padding-bottom">
                    <IonCardTitle className="ion-no-padding" color="primary">
                        Servicios
                    </IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="ion-no-padding">
                    <Pricing total={props.globalStats?.servicesTotalPrice}>
                        {Object.entries(props.globalStats?.servicesByType).map(k => {
                            const name = k[1].isSpecial ? `${k[0]}${k[1].amount > 1 ? ` x${k[1].amount}` : ""}` : `Vehículo ${k[0]} x${k[1].amount}`
                            return <PricingElement key={k[0]} name={name} price={k[1].total} />
                        })}
                    </Pricing>
                </IonCardContent>
            </IonCard>
            <IonCard className="ion-margin-bottom ion-padding">
                <IonCardHeader className="ion-no-padding ion-padding-bottom">
                    <IonCardTitle className="ion-no-padding" color="primary">
                        Empleados
                    </IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="ion-no-padding">
                    <Pricing total={props.globalStats.employeeEarningsTotal}>
                        {Object.entries(props.globalStats.earningsByEmployee).map(k => {
                            let clarification = null;
                            if (props.showClarification) {
                                const employee = props.employeeEarnings.find((ee: any) => ee.employee_name === k[0]);
                                if (employee.employee_privileged && (props.globalStats.servicesTotalPrice > (props.boxClosedOn.value ?? 0))) {
                                    clarification = k[1] - (props.globalStats.servicesTotalPrice - (props.boxClosedOn.value ?? 0));
                                };
                            };
                            return <PricingElement key={k[0]} name={k[0]} clarification={clarification} price={k[1]} />
                        })}
                    </Pricing>
                </IonCardContent>
            </IonCard>
            <IonCard className="ion-margin-bottom ion-padding">
                <IonCardHeader className="ion-no-padding">
                    <IonCardTitle className="ion-no-padding ion-padding-bottom" color="primary">
                        Ganancias
                    </IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="ion-no-padding">
                    <IonText className="ion-text-center" color="primary">
                        <h2 style={{ fontSize: "22px", fontWeight: "bold" }}>${formatNumber(props.globalStats.servicesTotalPrice - props.globalStats.employeeEarningsTotal)}</h2>
                    </IonText>
                </IonCardContent>
            </IonCard>
        </>
    )
};

WorkDayDetails.defaultProps = {
    showClarification: true,
}

export default WorkDayDetails;