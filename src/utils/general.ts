const formatDate = (date: Date, strFormat: string) => {

    const addZeroIfNeeded = (str: string) => str.length < 2 ? `0${str}` : str;

    const strFormayCpy = strFormat;
    const seconds = addZeroIfNeeded(date.getSeconds().toString());
    const minutes = addZeroIfNeeded(date.getMinutes().toString());
    const hours = addZeroIfNeeded(date.getHours().toString());
    const day = addZeroIfNeeded(date.getDate().toString());
    const DAY_STRINGS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const dayNames = DAY_STRINGS[date.getDay()];
    const month = addZeroIfNeeded((date.getMonth() + 1).toString());
    const year = date.getFullYear().toString();

    return strFormayCpy.replace(/%s/g, seconds)
        .replace(/%m/g, minutes)
        .replace(/%h/g, hours)
        .replace(/%D/g, day)
        .replace(/%ds/g, dayNames)
        .replace(/%M/g, month)
        .replace(/%Y/g, year);

};

const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const deepClone = (obj: object) => JSON.parse(JSON.stringify(obj));

export { formatDate, formatNumber, deepClone };