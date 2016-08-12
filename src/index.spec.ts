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

            var expectedPackageSpecs: Lib.ProjectBuildPackageSpecs = {
                npm: {
                    file: null,
                    missing: true
                },
                files: []
            };

            projectMock.listAllFiles.and.returnValue(Promise.resolve(projectFiles));

            lib.getSpecs()
                .then(specs => {
                    expect(specs.packages.length).toBe(1);
                    expect(specs.packages[0]).toEqual(expectedPackageSpecs);
                    done();
                });
        });

        it("list all packages", done => {
            var projectFiles = [
                "client/package.json",
                "server/package.json"
            ];

            var expectedPackagesSpecs: Lib.ProjectBuildPackageSpecs[] = [
                {
                    npm: {
                        file: "client/package.json",
                        missing: false
                    },
                    files: [
                        "client/package.json"
                    ]
                },
                {
                    npm: {
                        file: "server/package.json",
                        missing: false
                    },
                    files: [
                        "server/package.json"
                    ]
                }
            ];

            projectMock.listAllFiles.and.returnValue(Promise.resolve(projectFiles));

            lib.getSpecs()
                .then(specs => {
                    expect(specs.packages).toEqual(expectedPackagesSpecs);
                    done();
                });
        });

        describe("typescript", () => {
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
                        expect(specs.packages.length).toBe(1);
                        expect(specs.packages[0].typescript.configs).toEqual(expectedConfigs);
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

                var expectedFiles = [
                    "test.ts",
                    "client/test.ts"
                ];

                projectMock.listAllFiles.and.returnValue(Promise.resolve(projectFiles));

                lib.getSpecs()
                    .then(specs => {
                        expect(specs.packages.length).toBe(1);
                        expect(specs.packages[0].typescript.files).toEqual(expectedFiles);
                        done();
                    });
            });

            it("returns the typings file found", done => {
                var projectFiles = [
                    "test.ts",
                    "tsconfig.json",
                    "typings.json",
                    "client/tsconfig.json",
                    "client/test.ts"
                ];

                var expectedFile = "typings.json";

                projectMock.listAllFiles.and.returnValue(Promise.resolve(projectFiles));

                lib.getSpecs()
                    .then(specs => {
                        expect(specs.packages.length).toBe(1);
                        expect(specs.packages[0].typescript.typingsConfig).toEqual(expectedFile);
                        done();
                    });
            });

            it("returns null in typings file when not found", done => {
                var projectFiles = [
                    "test.ts",
                    "tsconfig.json",
                    "client/tsconfig.json",
                    "client/test.ts"
                ];

                var expectedFile = null;

                projectMock.listAllFiles.and.returnValue(Promise.resolve(projectFiles));

                lib.getSpecs()
                    .then(specs => {
                        expect(specs.packages.length).toBe(1);
                        expect(specs.packages[0].typescript.typingsConfig).toEqual(expectedFile);
                        done();
                    });
            });
        });

        describe("unitTests", () => {
            it("returns all spec files found", done => {
                var projectFiles = [
                    "test.spec.ts",
                    "tsconfig.json",
                    "client/tsconfig.json",
                    "client/test.spec.js"
                ];

                var expectedFiles = [
                    "test.spec.ts",
                    "client/test.spec.js"
                ];

                projectMock.listAllFiles.and.returnValue(Promise.resolve(projectFiles));

                lib.getSpecs()
                    .then(specs => {
                    expect(specs.packages.length).toBe(1);
                        expect(specs.packages[0].unitTests.files).toEqual(expectedFiles);
                        done();
                    });
            });
        });
    });
});