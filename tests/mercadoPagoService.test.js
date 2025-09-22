import { jest } from "@jest/globals";


const mockCreate = jest.fn();
const mockPreference = jest.fn(() => ({
  create: mockCreate,
}));

jest.unstable_mockModule("mercadopago", () => ({
  Preference: mockPreference,
}));


jest.unstable_mockModule("../services/mercadoPagoClient.js", () => ({
  mercadoPagoClient: jest.fn(() => ({})),
}));


const { processPayment } = await import("../services/mercadoPagoService.js");

describe("processPayment", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
    jest.clearAllMocks();
  });

  it("cria pagamento com dados do body", async () => {
    req.body = {
      title: "Cafeteira",
      price: 150,
      external_reference: "gift123",
    };

    mockCreate.mockResolvedValueOnce({ init_point: "http://init_point_url" });

    await processPayment(req, res);

    expect(mockPreference).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalledWith({
      body: {
        items: [
          { title: "Cafeteira", quantity: 1, unit_price: 150 },
        ],
        external_reference: "gift123",
        back_urls: {
          success: "https://casamentojoseevitoria.com/gifts",
          failure: "https://casamentojoseevitoria.com/gifts",
          pending: "https://casamentojoseevitoria.com/gifts",
        },
        auto_return: "approved",
      },
    });

    expect(res.json).toHaveBeenCalledWith({ init_point: "http://init_point_url" });
  });

  it("usa valores padrão se title não for fornecido", async () => {
    req.body = { price: 100, external_reference: "gift456" };
    mockCreate.mockResolvedValueOnce({ init_point: "http://init_point_default" });

    await processPayment(req, res);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          items: [{ title: "Presente de Casamento", quantity: 1, unit_price: 100 }],
        }),
      })
    );
    expect(res.json).toHaveBeenCalledWith({ init_point: "http://init_point_default" });
  });

  it("retorna erro 500 se criar pagamento falhar", async () => {
    req.body = { title: "Cafeteira", price: 150, external_reference: "gift123" };
    const error = new Error("Falha no MP");
    mockCreate.mockRejectedValueOnce(error);

    await processPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao criar pagamento" });
  });
});
