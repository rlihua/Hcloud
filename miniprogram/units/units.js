//格式化显示时间

const formatDate = (d) =>  {

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

module.exports = {
  formatDate
}