import { expect, vi } from "vitest";
import { validateDeployOptions } from "./deploy";

describe("deploy command", () => {
  it("validates options correctly", () => {
    // @ts-expect-error necessary to mock the process.exit() function
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const spy = vi.spyOn(process, "exit").mockImplementation(() => {});
    validateDeployOptions({});
    expect(spy).not.toHaveBeenCalled();

    validateDeployOptions({
      fieldPluginName: "hello",
    });
    expect(spy).not.toHaveBeenCalled();

    validateDeployOptions({
      fieldPluginName: "hello",
      skipPrompts: true,
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it("fails when skipPrompts is given without fieldPluginName", () => {
    // @ts-expect-error necessary to mock the process.exit() function
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    validateDeployOptions({
      skipPrompts: true,
    });
    expect(exitSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      "[ERROR]",
      "Cannot skip prompts without name.\n"
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      "Use --name option to define a plugin name!"
    );
  });
});
