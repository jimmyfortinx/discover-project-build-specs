import * as proxyquire from "proxyquire";
import * as callbacks from "./testsHelpers/callbacks";
import * as Project from "./project";

describe("Project", function () {
    var returnedFiles = [
        "node_module/test.js",
        "node_module/folder/test2.js",
        "test/test.js",
        "app/test/test.js",
        "app/test/folder/test.js",
        "app/folder/test.js",
        "test.js",
        "test2.js"
    ];

    var project: typeof Project;
    var dirMock;
    var cwdSpy;

    beforeEach(function () {
        dirMock = {
            files: callbacks.success(returnedFiles)
        };

        cwdSpy = spyOn(process, "cwd");

        project = proxyquire<typeof Project>("./project", {
            "node-dir": dirMock
        });
    });

    it("lists all files in the current project", (done) => {
        project.listAllFiles()
            .then(files => {
                expect(cwdSpy).toHaveBeenCalled();
                expect(files).toEqual(returnedFiles);
                done();
            });
    });

    it("lists all files in the current project and remove each matching the exclusion", (done) => {
        var expectedFiles = [
            "test/test.js",
            "app/test/test.js",
            "app/test/folder/test.js",
            "app/folder/test.js",
            "test.js",
            "test2.js"
        ];

        project.listAllFiles("!node_module/**")
            .then(files => {
                expect(cwdSpy).toHaveBeenCalled();
                expect(files).toEqual(expectedFiles);
                done();
            });
    });

    it("lists all files in the current project and remove each matching all exclusions", (done) => {
        var expectedFiles = [
            "test/test.js",
            "app/test/folder/test.js",
            "app/folder/test.js",
            "test.js",
            "test2.js"
        ];

        project.listAllFiles([
            "!node_module/**",
            "!**/test/*"
        ])
            .then(files => {
                expect(cwdSpy).toHaveBeenCalled();
                expect(files).toEqual(expectedFiles);
                done();
            });
    });

    it("fails when an error append", (done) => {
        dirMock.files = callbacks.fail("error");

        project.listAllFiles()
            .catch(error => {
                expect(cwdSpy).toHaveBeenCalled();
                expect(error).toBe("error");
                done();
            });
    });
});