import express from "express";
import cors from "cors";
import { processPayment } from "./services/mercadoPagoService.js";
import dotenv from "dotenv";

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
  await sendWebhook(req, res);
}); 

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

