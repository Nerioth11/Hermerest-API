function getTodaysDate() {
    today = new Date()
    day = today.getDate();
    month = today.getMonth() + 1;
    year = today.getFullYear();

    return ((day < 10) ? "0" + day : day) +
        "/" +
        ((month < 10) ? "0" + month : month) +
        "/" +
        year;
}

function dateInputToString(date) {
    return date.substring(8, 10) + "/" + date.substring(5, 7) + "/" + date.substring(0, 4);
}

function dateComparator(date1, date2) {
    if (date1 === date2) return 0;
    if (date1.substring(6, 10) > date2.substring(6, 10)) return 1;
    if (date1.substring(6, 10) < date2.substring(6, 10)) return -1;
    if (date1.substring(3, 5) > date2.substring(3, 5)) return 1;
    if (date1.substring(3, 5) < date2.substring(3, 5)) return -1;
    if (date1.substring(0, 2) > date2.substring(0, 2)) return 1;
    else return -1;
}