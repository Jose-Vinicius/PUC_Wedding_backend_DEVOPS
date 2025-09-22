import { isDevelopmentEnvironment } from "../server.js";

describe("isDevelopmentEnvironment", () => {
  it("retorna 'development' se a variável não estiver definida", () => {
    delete process.env.ENV;
    expect(isDevelopmentEnvironment()).toBe("development");
  });

  it("retorna o valor de process.env.ENV se definido", () => {
    process.env.ENV = "production";
    expect(isDevelopmentEnvironment()).toBe("production");
  });
});
