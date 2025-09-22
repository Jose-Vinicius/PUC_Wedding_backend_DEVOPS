import { jest } from "@jest/globals";


jest.unstable_mockModule("../server.js", () => ({
  isDevelopmentEnvironment: jest.fn(),
}));


const mockMercadoPagoConfig = jest.fn();
jest.unstable_mockModule("mercadopago", () => ({
  MercadoPagoConfig: mockMercadoPagoConfig,
}));

let mercadoPagoClient;
let isDevelopmentEnvironment;

beforeAll(async () => {
  const server = await import("../server.js");
  isDevelopmentEnvironment = server.isDevelopmentEnvironment;

  const mod = await import("../services/mercadoPagoClient.js");
  mercadoPagoClient = mod.mercadoPagoClient;
});

beforeEach(() => {
  jest.clearAllMocks();
  process.env.MERCADO_PAGO_ACCESS_TOKEN_DEV = "dev-token";
  process.env.MERCADO_PAGO_ACCESS_TOKEN_PROD = "prod-token";
});

describe("mercadoPagoClient", () => {
  test("usa o token de DEV quando isDevelopmentEnvironment retorna true", () => {
    isDevelopmentEnvironment.mockReturnValue(true);

    mercadoPagoClient();

    expect(mockMercadoPagoConfig).toHaveBeenCalledWith({
      accessToken: "dev-token",
    });
  });

  test("usa o token de PROD quando isDevelopmentEnvironment retorna false", () => {
    isDevelopmentEnvironment.mockReturnValue(false);

    mercadoPagoClient();

    expect(mockMercadoPagoConfig).toHaveBeenCalledWith({
      accessToken: "prod-token",
    });
  });
});
