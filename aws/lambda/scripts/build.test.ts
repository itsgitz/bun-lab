import { test, expect, describe } from "bun:test";
import { buildLocalTag, buildRemoteTag } from "./build";

describe("buildLocalTag", () => {
  test('returns "imageName:imageTag" format', () => {
    expect(buildLocalTag("bun-lab-lambda", "latest")).toBe("bun-lab-lambda:latest");
  });

  test("handles versioned tags", () => {
    expect(buildLocalTag("my-app", "v1.2.3")).toBe("my-app:v1.2.3");
  });
});

describe("buildRemoteTag", () => {
  test("returns ECR URI with tag", () => {
    expect(
      buildRemoteTag(
        "123456789.dkr.ecr.us-east-1.amazonaws.com/bun-lambda-demo",
        "latest"
      )
    ).toBe("123456789.dkr.ecr.us-east-1.amazonaws.com/bun-lambda-demo:latest");
  });

  test("handles arbitrary ECR URI and tag", () => {
    expect(buildRemoteTag("my-ecr-uri", "v2.0")).toBe("my-ecr-uri:v2.0");
  });
});
