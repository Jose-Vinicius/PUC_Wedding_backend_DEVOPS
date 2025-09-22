import { Payment } from "mercadopago";
import dotenv from "dotenv";
import { marcarPresenteComoPago } from "./baserowService.js";

dotenv.config();

export async function sendWebhook(req, res, client = {}) {
  try {
    const paymentID = req.body.data?.id;
    const type = req.body.type;

    if (type === "payment") {
      const paymentClient = new Payment(client);

      const payment = await paymentClient.get({ id: paymentID });

      const payerCompleteName = `${payment.payer.first_name} ${payment.payer.last_name}`;

      if (payment.status === "approved") {
        await marcarPresenteComoPago(payment.external_reference, payerCompleteName);
      }
    }

    res.status(200).send("Webhook recebido com sucesso");
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    res.status(500).send("Erro ao processar webhook");
  }
}
