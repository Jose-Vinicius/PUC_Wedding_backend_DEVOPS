import { Preference} from "mercadopago";
import { mercadoPagoClient } from "./mercadoPagoClient.js";

dotenv.config();

const mercadoPagoClient = mercadoPagoClient();

export async function processPayment(req, res) {
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
}


