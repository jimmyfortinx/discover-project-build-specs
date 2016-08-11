import * as dir from 'node-dir';
import * as minimatch from 'minimatch';
import * as _ from 'lodash';

function applyFilter(files: string[], filters?: string[] | string) {
    if (!filters) {
        return files;
    } else if (_.isString(filters)){
        return minimatch.match(files, filters, { matchBase: true });
    } else {
        var tests = _.map(filters, filter => minimatch.makeRe(filter, { matchBase: true }));

        return _.filter(files, file => {
            var result = true;

            _.forEach(tests, regex => {
                if(!regex.test(file)) {
                    result = false;
                    return false;
                }
            });

            return result;
        });
    }
}

export function listAllFiles(filter?: string[] | string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        dir.files(process.cwd(), (err, files) => {
            if(err) {
                reject(err);
            } else {
                resolve(applyFilter(files, filter));
            }
        });
    });
}