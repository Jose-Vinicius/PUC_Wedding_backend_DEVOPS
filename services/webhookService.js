import { MercadoPagoConfig, Payment } from "mercadopago";
import {isDevelopmentEnvironment} from "../server.js";

import { marcarPresenteComoPago } from "./services/baserowService.js";

dotenv.config();

const isENVDevelopment = isDevelopmentEnvironment();

const client = new MercadoPagoConfig({
   accessToken: isENVDevelopment === "development"
     ? process.env.MERCADO_PAGO_ACCESS_TOKEN_DEV
     : process.env.MERCADO_PAGO_ACCESS_TOKEN_PROD,
});

export async function sendWebhook(req, res) {
    try{
        const paymentID = req.body.data?.id;
        const type = req.body.type;
    
        if (type === "payment"){
    
          const paymentClient = new Payment(client);
        
          const payment = await paymentClient.get({
            id: paymentID
          });
    
          const payer = payment.payer
          const payerName = payer.first_name;
          const payerLastName = payer.last_name;
    
          const payerCompleteName = `${payerName} ${payerLastName}`;
    
          if(payment.status === "approved") {
            const giftIdentificator = payment.external_reference;
     
            await marcarPresenteComoPago(giftIdentificator, payerCompleteName);
    
          }
        }
        res.status(200).send("Webhook recebido com sucesso");
      }catch (error) {
        console.error("Erro ao processar webhook:", error);
        res.status(500).send("Erro ao processar webhook");
      }
}