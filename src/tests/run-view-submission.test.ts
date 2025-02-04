import { assertEquals, assertExists, assertRejects } from "../dev_deps.ts";
import { RunViewSubmission } from "../run-view-submission.ts";
import { generateViewSubmissionPayload } from "./test_utils.ts";
import { UnhandledEventError } from "../run-unhandled-event.ts";
import { FunctionModule } from "../types.ts";

Deno.test("RunViewSubmission function", async (t) => {
  await t.step("should be defined", () => {
    assertExists(RunViewSubmission);
  });

  await t.step("should run handler", async () => {
    const payload = generateViewSubmissionPayload();

    const viewSubmissionResp = {
      burp: "adurp",
    };

    const fnModule = {
      default: () => ({}),
      viewSubmission: () => {
        return viewSubmissionResp;
      },
    };
    const resp = await RunViewSubmission(payload, fnModule);

    assertEquals(resp, viewSubmissionResp);
  });

  await t.step("should run nested handler", async () => {
    const payload = generateViewSubmissionPayload();

    const viewSubmissionResp = {
      burp: "adurp",
    };

    const fnModule: FunctionModule = {
      default: () => ({}),
      viewSubmission: () => viewSubmissionResp,
    };
    fnModule.default.viewSubmission = () => ({ no: "way" });

    const resp = await RunViewSubmission(payload, fnModule);

    assertEquals(resp, viewSubmissionResp);
  });

  await t.step(
    "should return an empty resp if no handler defined",
    async () => {
      const payload = generateViewSubmissionPayload();

      const fnModule = {
        default: () => ({}),
      };

      await assertRejects(
        () => RunViewSubmission(payload, fnModule),
        UnhandledEventError,
        "view_submission",
      );
    },
  );
});
