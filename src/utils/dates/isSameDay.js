const compareDays = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

export default (...dates) => {
    const toCompare = dates[0];

    return dates.every((date) => compareDays(date, toCompare));
};
