import { DEBUG }from './config'

let log
if (DEBUG) log = console.log.bind(window.console)
else log = function(){}
export { log }

export function reindexArray (array, idField) {
    var obj = {}, i, record;

    if (Object.prototype.toString.call(array) !== '[object Array]') {
        throw new Error('Type error');
    }

    if (!idField) {
        throw new Error('idField is required');
    }

    i = array.length;
    while (i--) {
        record = array[i];
        if (record.hasOwnProperty(idField)) {
            obj[ record[ idField ] ] = record;
        }
    }

    return obj;
};

export function getDateForPicker(date = '') {
    let d;
    if (date == ''){
        d = new Date();
    } else {
        d = new Date(date);
    }
    return d.getFullYear() + '-' 
        + appendLeadingZero(d.getMonth()) + '-' 
        + appendLeadingZero(d.getDay()) + 'T'
        + appendLeadingZero(d.getHours()) + ':'
        + appendLeadingZero(d.getMinutes())
}

function appendLeadingZero(num) {
    if (num < 10) {
        return '0' + num
    } else {
        return num
    }
}
