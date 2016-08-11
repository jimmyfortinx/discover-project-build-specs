import * as callbacks from "./callbacks";

describe("testsHelpers.callbacks", () => {
    describe("success", () => {
        it("returns a function", () => {
            expect(callbacks.success("test")).toEqual(jasmine.any(Function));
        });

        it("returns the value when the callback is called with no additionnal parameters", () => {
            var callback = jasmine.createSpy("callback");

            callbacks.success("test")(callback);

            expect(callback).toHaveBeenCalledWith(null, "test");
        });

        it("returns the value when the callback is called with one additionnal parameters", () => {
            var callback = jasmine.createSpy("callback");

            callbacks.success("test")("first", callback);

            expect(callback).toHaveBeenCalledWith(null, "test");
        });

        it("returns the value when the callback is called with two additionnal parameters", () => {
            var callback = jasmine.createSpy("callback");

            callbacks.success("test")("first", "second", callback);

            expect(callback).toHaveBeenCalledWith(null, "test");
        });
    });

    describe("fail", () => {
        it("returns a function", () => {
            expect(callbacks.fail("test")).toEqual(jasmine.any(Function));
        });

        it("returns an error when the callback is called with no additionnal parameters", () => {
            var callback = jasmine.createSpy("callback");

            callbacks.fail("error")(callback);

            expect(callback).toHaveBeenCalledWith("error", undefined);
        });

        it("returns an error when the callback is called with one additionnal parameters", () => {
            var callback = jasmine.createSpy("callback");

            callbacks.fail("error")("first", callback);

            expect(callback).toHaveBeenCalledWith("error", undefined);
        });

        it("returns an error when the callback is called with two additionnal parameters", () => {
            var callback = jasmine.createSpy("callback");

            callbacks.fail("error")("first", "second", callback);

            expect(callback).toHaveBeenCalledWith("error", undefined);
        });

        it("returns also a value when specified", () => {
            var callback = jasmine.createSpy("callback");

            callbacks.fail("error", "value")(callback);

            expect(callback).toHaveBeenCalledWith("error", "value");
        });
    });
});