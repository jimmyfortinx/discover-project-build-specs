import * as proxyquire from "proxyquire";
import * as Lib from "./index";

describe("Lib", () => {
    var lib: typeof Lib;
    var projectMock: {
        listAllFiles: jasmine.Spy;
    };

    beforeEach(() => {
        projectMock = {
            listAllFiles: jasmine.createSpy("projectMock.listAllFiles")
        }

        lib = proxyquire<typeof Lib>("./index", {
            "./project": projectMock
        });
    });

    describe("getSpecs", () => {
        it("returns an empty specs file when no files", done => {
            var projectFiles = [];

            var expectedSpecs = {
                typescript: {
                    configs: [],
                    src: [],
                    required: false
                }
            };

            projectMock.listAllFiles.and.returnValue(Promise.resolve(projectFiles));

            lib.getSpecs()
                .then(specs => {
                    expect(specs).toEqual(expectedSpecs);
                    done();
                });
        });

        it("returns all typescript configuration files found", done => {
            var projectFiles = [
                "test.ts",
                "tsconfig.json",
                "client/tsconfig.json",
                "client/test.ts"
            ];

            var expectedConfigs = [
                "tsconfig.json",
                "client/tsconfig.json"
            ];

            projectMock.listAllFiles.and.returnValue(Promise.resolve(projectFiles));

            lib.getSpecs()
                .then(specs => {
                    expect(specs.typescript.configs).toEqual(expectedConfigs);
                    done();
                });
        });

        it("requires typescript if typescript files are found", done => {
            var projectFiles = [
                "tsconfig.json",
                "client/tsconfig.json"
            ];

            projectMock.listAllFiles.and.returnValue(Promise.resolve(projectFiles));

            lib.getSpecs()
                .then(specs => {
                    expect(specs.typescript.required).toEqual(true);
                    done();
                });
        });

        it("returns all typescript files found", done => {
            var projectFiles = [
                "test.ts",
                "tsconfig.json",
                "client/tsconfig.json",
                "client/test.ts"
            ];

            var expectedSrc = [
                "test.ts",
                "client/test.ts"
            ];

            projectMock.listAllFiles.and.returnValue(Promise.resolve(projectFiles));

            lib.getSpecs()
                .then(specs => {
                    expect(specs.typescript.src).toEqual(expectedSrc);
                    done();
                });
        });

        it("requires typescript if typescript files are found", done => {
            var projectFiles = [
                "test.ts",
                "client/test.ts"
            ];

            projectMock.listAllFiles.and.returnValue(Promise.resolve(projectFiles));

            lib.getSpecs()
                .then(specs => {
                    expect(specs.typescript.required).toEqual(true);
                    done();
                });
        });
    });
});