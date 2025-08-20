import { MercadoPagoConfig } from "mercadopago";
import {isDevelopmentEnvironment} from "../server.js";

dotenv.config();

const isENVDevelopment = isDevelopmentEnvironment();

export const mercadoPagoClient = () => new MercadoPagoConfig({
   accessToken: isENVDevelopment === "development"
     ? process.env.MERCADO_PAGO_ACCESS_TOKEN_DEV
     : process.env.MERCADO_PAGO_ACCESS_TOKEN_PROD,
});