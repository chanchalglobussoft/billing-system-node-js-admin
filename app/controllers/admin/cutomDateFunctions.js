//Custome Date Function for easy usage of dates in Queries

//Written By: Syed Arshad

function getDaysInMonth(m, year) {
    var month = m - 1; //month starts from 0
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        var trimDate = new Date(date);
        var stringDate = trimDate.toString();
        var splitDate = stringDate.split(" ");
        var formatttedDate = splitDate[0] + " " + splitDate[2] + "/" + m + "/" + year;
        days.push(formatttedDate);
        date.setDate(date.getDate() + 1);
    }
    return days;
}
//Eg: getDaysInMonth(6,2015)
//[ 'Mon 01/6/2015',...
//  'Tue 30/6/2015' ]
//--------------------------------------------------------------------------------------------
function getOnlyDaysInMonth(m, year) {
    var month = m - 1; //month starts from 0
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        var trimDate = new Date(date);
        var stringDate = trimDate.toString();
        var splitDate = stringDate.split(" ");
        var formatttedDate = year + "/" + m + "/" + splitDate[2];
        days.push(formatttedDate);
        date.setDate(date.getDate() + 1);
    }
    return days;
}
//Eg: getOnlyDaysInMonth(7,2015)
//[ '2015/7/01', ...
//  '2015/7/31' ]
//--------------------------------------------------------------------------------------------
function getOnlyDayNameInMonth(m, year) {
    var month = m - 1; //month starts from 0
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        var trimDate = new Date(date);
        var stringDate = trimDate.toString();
        var splitDate = stringDate.split(" ");
        var formatttedDate = splitDate[0];
        days.push(formatttedDate);
        date.setDate(date.getDate() + 1);
    }
    return days;
}


exports.getDaysInMonth = getDaysInMonth;
exports.getOnlyDaysInMonth = getOnlyDaysInMonth;
exports.getOnlyDayNameInMonth = getOnlyDayNameInMonth;