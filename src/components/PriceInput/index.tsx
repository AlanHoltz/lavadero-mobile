import { IonItem, IonLabel, IonInput, IonNote } from "@ionic/react";
import './PriceInput.css';
import { ReactNode, useState } from "react";
import { formatNumber } from "../../utils/general";

interface PriceInputProps {
    price?: number | null,
    onChange?: any,
    onBlur?: any,
    error?: string | null,
    label: string,
    button?: ReactNode,
};

const PriceInput: React.FC<PriceInputProps> = (props) => {

    const [formattedPrice, setFormattedPrice] = useState<string | null>(props.price ? formatNumber(props.price) : null);

    return (
        <IonItem className={`ion-margin-bottom ion-no-padding ${props.error && "ion-invalid"} main_new_service_special_input`}>
            <IonLabel color="primary" position="stacked">{props.label}</IonLabel>
            <IonInput inputMode='numeric' value={formattedPrice}
                onIonBlur={props.onBlur}
                onIonInput={(e) => {

                    let numberWithoutCommas = e.target.value?.toString().replace(/,/g, "") ?? "0";

                    if (!numberWithoutCommas) {
                        setFormattedPrice(null);
                        if (props.onChange) props.onChange(null);
                        return;
                    };

                    if (Number.isNaN(+numberWithoutCommas)) {
                        e.preventDefault();
                        e.target.value = formattedPrice;
                        return;
                    };

                    setFormattedPrice(formatNumber(+numberWithoutCommas));
                    if (props.onChange) props.onChange(+numberWithoutCommas);

                }} color="primary"></IonInput>
                {props.button}
            <IonNote slot='error'>{props.error}</IonNote>
        </IonItem>
    )
};

export default PriceInput;