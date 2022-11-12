export default (date) => {
    const now = new Date();
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getMonth() && date.getDate() === now.getDate();
}