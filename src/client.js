import whatsapp from "whatsapp-web.js"
import qrImage from "qr-image"
import { processarMensagem } from "./chat.js"

const { Client, LocalAuth } = whatsapp

export function prepararConexaoWhatsapp() {
    const client = new Client({
        authStrategy: new LocalAuth(), // Salva a sessão
        puppeteer: {
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        }
    })

    return new Promise((resolve, reject) => {
        client.on("ready", () => {
            console.log("✅ WhatsApp conectado com sucesso!")
        })

        client.on("message", async (msg) => {
            if (msg.type === "chat") {
                console.log("📩 Mensagem recebida:", msg.body)
                await processarMensagem(client, msg)
            }
        })

        client.on("qr", (qr) => {
            const qrCode = qrImage.image(qr, { type: "png" })
            resolve(qrCode)
        })

        client.on("auth_failure", (msg) => {
            console.error("❌ Falha de autenticação:", msg)
            reject(new Error("Falha na autenticação"))
        })

        client.initialize()
    })
}
