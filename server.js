import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import dotenv from "dotenv";

import { marcarPresenteComoPago } from "./services/baserowService.js";

const isENVDevelopment = false;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const client = new MercadoPagoConfig({
   accessToken: isENVDevelopment
     ? process.env.MERCADO_PAGO_ACCESS_TOKEN_DEV
     : process.env.MERCADO_PAGO_ACCESS_TOKEN_PROD,
});


// Endpoint de criação de pagamento
app.post("/pagamento", async (req, res) => {
  const { title, price, external_reference } = req.body;

  try {
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            title: title || "Presente de Casamento",
            quantity: 1,
            unit_price: Number(price),
          },
        ],
        external_reference: external_reference,
        back_urls: {
          success: "https://casamentojoseevitoria.com/gifts",
          failure: "https://casamentojoseevitoria.com/gifts",
          pending: "https://casamentojoseevitoria.com/gifts",
        },
        auto_return: "approved"
      },
    });

    res.json({ init_point: response.init_point });
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
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

