import * as minimatch from "minimatch";
import * as _ from "lodash";
import * as project from "./project";

export interface ProjectBuildSpecs {
    typescript: {
        src: string[],
        configs: string[],
        required: boolean
    }
}

export function getSpecs(): Promise<ProjectBuildSpecs> {
    return project.listAllFiles()
        .then(files => {
            var typescriptSrc = minimatch.match(files, "**/*.ts");
            var typescriptConfigs = minimatch.match(files, "**/tsconfig.json");

            return {
                typescript: {
                    src: typescriptSrc,
                    configs: typescriptConfigs,
                    required: !(_.isEmpty(typescriptSrc) && _.isEmpty(typescriptConfigs))
                }
            };
        });
}