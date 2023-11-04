import { describe, it } from "@jest/globals";
import frisby from "frisby";

describe("Application end-to-end test", () => {
  beforeAll(() => {
    frisby.globalSetup({
      request: {
        baseUrl: "http://localhost:3523",
      },
    });
  });

  describe("Local auth strategy", () => {
    it("Should fail the login", () => {
      frisby
        .post("/auth/local/login", {
          email: "apunthelegend@outlook.com",
          password: "wrong password",
        })
        .expect("status", 401);
    });

    it("Should login the user", () => {
      frisby
        .post("/auth/local/login", {
          email: "apunthelegend@outlook.com",
          password: "rand",
        })
        .expect("status", 200);
    });

    it("Should logout the user", () => {
      frisby.post("/auth/local/logout");
    });
  });
});
