import * as _ from "lodash";

export function success(value) {
    return function (...params: any[]) {
        var callback = _.last(params);

        callback(null, value);
    };
}

export function fail(error: any, value?: any) {
    return function (...params: any[]) {
        var callback = _.last(params);

        callback(error, value);
    };
}