
import { jest } from "@jest/globals";

// mocks
const mockMarcarPresenteComoPago = jest.fn();
const mockGet = jest.fn();


jest.unstable_mockModule("../services/baserowService.js", () => ({
  marcarPresenteComoPago: mockMarcarPresenteComoPago,
}));

jest.unstable_mockModule("mercadopago", () => ({
  Payment: jest.fn().mockImplementation(() => ({
    get: mockGet,
  })),
}));


let sendWebhook;
beforeAll(async () => {
  const mod = await import("../services/webhookService.js");
  sendWebhook = mod.sendWebhook;
});

describe("sendWebhook", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    mockMarcarPresenteComoPago.mockClear();
    mockGet.mockClear();
  });

  test("deve marcar presente como pago quando o pagamento for aprovado", async () => {
    req.body = { type: "payment", data: { id: "123" } };
    mockGet.mockResolvedValue({
      payer: { first_name: "João", last_name: "Silva" },
      status: "approved",
      external_reference: "presente123",
    });

    await sendWebhook(req, res);

    expect(mockGet).toHaveBeenCalledWith({ id: "123" });
    expect(mockMarcarPresenteComoPago).toHaveBeenCalledWith(
      "presente123",
      "João Silva"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("Webhook recebido com sucesso");
  });

  test("não deve chamar marcarPresenteComoPago se status não for aprovado", async () => {
    req.body = { type: "payment", data: { id: "456" } };
    mockGet.mockResolvedValue({
      payer: { first_name: "Maria", last_name: "Oliveira" },
      status: "pending",
      external_reference: "presente456",
    });

    await sendWebhook(req, res);

    expect(mockMarcarPresenteComoPago).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("Webhook recebido com sucesso");
  });
});
