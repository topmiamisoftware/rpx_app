"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeFormatPipe = exports.DateFormatPipe = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
let DateFormatPipe = class DateFormatPipe {
    transform(d) {
        const format_date = monthNames[d.getMonth()] + ' ' + (d.getDate() + 1) + ', ' + d.getFullYear();
        return format_date;
    }
};
DateFormatPipe = tslib_1.__decorate([
    (0, core_1.Pipe)({
        name: 'dateFormat'
    })
], DateFormatPipe);
exports.DateFormatPipe = DateFormatPipe;
let TimeFormatPipe = class TimeFormatPipe {
    transform(timex) {
        const time = timex.split(':'); // convert to array
        // fetch
        const hours = Number(time[0]);
        const minutes = Number(time[1]);
        const seconds = Number(time[2]);
        // calculate
        let timeValue;
        if (hours > 0 && hours <= 12) {
            timeValue = '' + hours;
        }
        else if (hours > 12) {
            timeValue = '' + (hours - 12);
        }
        else if (hours == 0) {
            timeValue = '12';
        }
        timeValue += (minutes < 10) ? ':0' + minutes : ':' + minutes; // get minutes
        timeValue += (hours >= 12) ? ' PM' : ' AM'; // get AM/PM
        return timeValue;
    }
};
TimeFormatPipe = tslib_1.__decorate([
    (0, core_1.Pipe)({
        name: 'timeFormat'
    })
], TimeFormatPipe);
exports.TimeFormatPipe = TimeFormatPipe;
//# sourceMappingURL=date-format.pipe.js.map