import { default as whatsapp } from "whatsapp-web.js"
import qrImage from "qr-image"
import { processarMensagem } from "./chat.js"

export function prepararConexaoWhatsapp() {
    const client = new whatsapp.Client({
        authStrategy: new whatsapp.LocalAuth(), // Salva a sessão para evitar reescanear o QR
        puppeteer: {
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        }
    })

    return new Promise((resolve, reject) => {
        client.on("ready", () => {
            console.log(
                "✅ WhatsApp conectado com sucesso! Bot da Brito’s Locações está ativo."
            )
        })

        // Captura todas as mensagens recebidas
        client.on("message", async (msg) => {
            console.log("📩 Mensagem recebida:", msg.body);
            if (msg.type === "chat") {
                msg.reply("📨 Recebido! Seu bot está vivo 🔥")
            }
        })

        client.on("qr", (qr) => {
            const qrCode = qrImage.image(qr, { type: "png" })
            resolve(qrCode)
        })

        client.initialize()
    })
}
