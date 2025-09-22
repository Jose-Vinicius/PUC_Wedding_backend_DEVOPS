// services/mercadoPagoClient.js
import { MercadoPagoConfig } from "mercadopago";
import dotenv from "dotenv";
import { isDevelopmentEnvironment } from "../server.js";

dotenv.config();

export const mercadoPagoClient = () => {
  const isDev = isDevelopmentEnvironment();
  return new MercadoPagoConfig({
    accessToken: isDev
      ? process.env.MERCADO_PAGO_ACCESS_TOKEN_DEV
      : process.env.MERCADO_PAGO_ACCESS_TOKEN_PROD,
  });
};
