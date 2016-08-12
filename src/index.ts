import * as minimatch from "minimatch";
import * as _ from "lodash";
import * as path from "path";
import * as project from "./project";

export interface ProjectBuildPackageTypescriptSpecs {
    files: string[],
    configs: string[],
    typingsConfig: string
}

export interface ProjectBuildPackageUnitTestsSpecs {
    files: string[]
}

export interface ProjectBuildPackageSpecs {
    typescript?: ProjectBuildPackageTypescriptSpecs,
    unitTests?: ProjectBuildPackageUnitTestsSpecs,
    npm: {
        file: string,
        missing: boolean
    },
    files: string[]
}

export interface ProjectBuildSpecs {
    packages: ProjectBuildPackageSpecs[]
}

function getPackages(files: string[]) {
    var packages = minimatch.match(files, "**/package.json");

    if (packages.length) {
        return packages;
    } else {
        return null;
    }
}

function getPackageSpecs(packageFile: string, projectFiles: string[]) : ProjectBuildPackageSpecs {
    if (packageFile) {
        var packageRootPath = path.dirname(packageFile);

        return {
            npm: {
                file: packageFile,
                missing: false
            },
            files: minimatch.match(projectFiles, packageRootPath + "**/*")
        };
    } else {
        return {
            npm: {
                file: null,
                missing: true
            },
            files: projectFiles
        };
    }
}

function getTypescriptSpecs(packageSpecs: ProjectBuildPackageSpecs): ProjectBuildPackageTypescriptSpecs {
    var typescriptFiles = minimatch.match(packageSpecs.files, "**/*.ts");
    var typescriptConfigs = minimatch.match(packageSpecs.files, "**/tsconfig.json");
    var typingConfig = minimatch.match(packageSpecs.files, "typings.json");

    if(_.isEmpty(typescriptFiles) && _.isEmpty(typescriptConfigs)) {
        return null;
    }

    return {
        files: typescriptFiles,
        configs: typescriptConfigs,
        typingsConfig: _.isEmpty(typingConfig) ? null : _.first(typingConfig)
    };
}

function getUnitTestsSpecs(packageSpecs: ProjectBuildPackageSpecs): ProjectBuildPackageUnitTestsSpecs {
    var unitTestsFiles = minimatch.match(packageSpecs.files, "**/*.spec.*");

    if(_.isEmpty(unitTestsFiles)) {
        return null;
    }

    return {
        files: unitTestsFiles
    };
}

function completePackageSpecs(packagesSpecs: ProjectBuildPackageSpecs[]): ProjectBuildPackageSpecs[] {
    return _.map(packagesSpecs, specs => {
        var typescriptSpecs = getTypescriptSpecs(specs);
        var unitTestsSpecs = getUnitTestsSpecs(specs);

        if(typescriptSpecs) {
            specs.typescript = typescriptSpecs;
        }

        if(unitTestsSpecs) {
            specs.unitTests = unitTestsSpecs;
        }

        return specs;
    });
}

export function getSpecs(): Promise<ProjectBuildSpecs> {
    return project.listAllFiles()
        .then(files => {
            var packages = getPackages(files);

            if(_.isEmpty(packages)) {
                return [getPackageSpecs(null, files)];
            } else {
                return _.map(packages, packageFile => {
                    return getPackageSpecs(packageFile, files);
                });
            }
        })
        .then(completePackageSpecs)
        .then(packagesSpecs => {
            return {
                packages: packagesSpecs
            };
        });
}