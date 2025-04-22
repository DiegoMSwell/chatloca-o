import { Client, LocalAuth } from "whatsapp-web.js";
import qrImage from "qr-image";
import { processarMensagem } from "./chat.js";

export function prepararConexaoWhatsapp() {
    const client = new Client({
        authStrategy: new LocalAuth(), // Salva a sessão automaticamente
        puppeteer: {
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"], // Obrigatório no Render!
        },
    });

    return new Promise((resolve, reject) => {
        client.on("ready", () => {
            console.log("✅ WhatsApp conectado com sucesso! Bot da Brito’s Locações está ativo.");
        });

        client.on("message", async (msg) => {
            if (msg.type === "chat") {
                console.log("📩 Mensagem recebida:", msg.body);
                await processarMensagem(client, msg);
            }
        });

        client.on("qr", (qr) => {
            const qrCode = qrImage.image(qr, { type: "png" });
            resolve(qrCode);
        });

        client.initialize();
    });
}
