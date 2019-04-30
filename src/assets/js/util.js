
/**
 * 时间格式化工具
 * @type {{parseTime: timeUtil.parseTime, formatTime: timeUtil.formatTime}}
 * @Usage
 * 列表中的转换 parseTime: {{scope.row.created | parseTime('{y}-{m}-{d} {h}:{i}')}}
 * 详细页面 parseTime: created=parseTime(created, '{y}-{m}-{d} {h}:{i}')
 */
var timeUtil = {
    // 时间戳转换
    TimestampToDate(Timestamp) {
        var date = new Date(Timestamp);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var moment = date.getMinutes();
        var scents = date.getSeconds();
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        hours = hours < 10 ? '0' + hours : hours;
        moment = moment < 10 ? '0' + moment : moment;
        scents = scents < 10 ? '0' + scents : scents;
        return year + '-' + month + '-' + day + ' ' + hours + ':' + moment + ':' + scents;
    },
    // 输入框时间转标准时间 加8小时
    renderTime(date) {
        if (date.toString().length>1){
            var dateee = new Date(date).toJSON();
            return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        }
        return null
    }
}