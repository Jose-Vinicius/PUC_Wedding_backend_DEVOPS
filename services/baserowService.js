import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

const BASEROW_API_KEY = process.env.BASEROW_API_KEY;

const base_url = "https://api.baserow.io/api/database"
const table_gifts_id = "451458"
const field_gift_identificator = "4905932"


const baserow_api = axios.create({
    baseURL: base_url,
    headers:{
        "Authorization": `Token ${BASEROW_API_KEY}`,
        "Content-Type": "application/json"
    }
})

export async function marcarPresenteComoPago(giftIdentificator, payerCompleteName) {
    try {
        const response = await baserow_api.get(`/rows/table/${table_gifts_id}/?user_field_names=true&filter__field_${field_gift_identificator}__contains=${giftIdentificator}`);
        const gift = response.data.results[0];

        if (gift) {
            const updatedData = {
                gift_paid: true,
                gift_payer_name: payerCompleteName || "Anônimo",
            };

            await baserow_api.patch(`/rows/table/${table_gifts_id}/${gift.id}/?user_field_names=true`, updatedData);
            console.log(`Presente ${giftIdentificator} marcado como pago.`);
        } else {
            console.error(`Presente com identificador ${giftIdentificator} não encontrado.`);
        }
    } catch (error) {
        console.error("Erro ao marcar presente como pago:", error);
    }
}