// tests/baserowService.test.js
import { jest } from "@jest/globals";

// cria mocks fixos
const patchMock = jest.fn();
const getMock = jest.fn();

jest.unstable_mockModule("axios", () => ({
  default: {
    create: jest.fn(() => ({
      get: getMock,
      patch: patchMock,
    })),
  },
}));

// importa o serviço depois de mockar
const { marcarPresenteComoPago } = await import("../services/baserowService.js");

describe("marcarPresenteComoPago", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("marca presente como pago quando encontrado", async () => {
    getMock.mockResolvedValueOnce({ data: { results: [{ id: 1 }] } });
    patchMock.mockResolvedValueOnce({});

    await marcarPresenteComoPago("gift123", "José");

    expect(patchMock).toHaveBeenCalled(); // agora bate certinho
  });
});
