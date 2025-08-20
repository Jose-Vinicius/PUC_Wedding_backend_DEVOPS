import express from "express";
import cors from "cors";
import { processPayment } from "./services/mercadoPagoService.js";
import dotenv from "dotenv";

import { marcarPresenteComoPago } from "./services/baserowService.js";


export function isDevelopmentEnvironment() {
  return process.env.DEVELOPMENT_ENV || "development";
}

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// Endpoint de criação de pagamento
app.post("/pagamento", async (req, res) => {
  await processPayment(req, res);
});


app.post("/webhook", async (req, res) => {
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
}); 

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

