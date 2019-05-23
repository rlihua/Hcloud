//格式化显示时间

const formatDate = (d) => {

    console.log(d);

    var date = getDate(d);

    console.log(date);

    var year = date.getFullYear();

    var month = date.getMonth() + 1;

    var day = date.getDate();

    console.log(day);

    var hour = date.getUTCHours();

    var minute = date.getUTCMinutes();

    var second = date.getUTCSeconds();

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');

}

var formatNumber = (n) => {

    n = n.toString()

    return n[1] ? n : '0' + n

}
// flag 1表示显示时分秒  2表示不显示
const myFormatDate = (date, flag) => {
    let d = new Date(date),
        year = d.getFullYear(),
        month = preAdd((d.getMonth() + 1)),
        day = preAdd(d.getDate()),
        hour = preAdd(d.getHours()),
        minute = preAdd(d.getMinutes()),
        seconds = preAdd(d.getSeconds()),
        newDate = year + '-' + month + '-' + day,
        datetime = flag == 2 ? newDate : newDate + ' ' + hour + ':' + minute + ':' + seconds
    return datetime;
}
const preAdd = (value) => {
    return value < 10 ? '0' + value : value
}
module.exports = {
    formatDate,
    myFormatDate
}