import { Client, LocalAuth } from "whatsapp-web.js"
import qrImage from "qr-image"

export function prepararConexaoWhatsapp() {
    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true, // Ambiente sem interface gráfica
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        }
    })

    return new Promise((resolve, reject) => {
        client.on("ready", () => {
            console.log("✅ WhatsApp conectado com sucesso!")
        })

        client.on("message", async (msg) => {
            console.log("📩 Mensagem recebida:", msg.body)
        })

        client.on("qr", (qr) => {
            const qrCode = qrImage.image(qr, { type: "png" })
            resolve(qrCode) // Retorna o QR code gerado
        })

        client.on("auth_failure", () => {
            console.error("Erro de autenticação. Verifique sua sessão.")
            reject(new Error("Erro de autenticação"))
        })

        client.on("disconnected", (reason) => {
            console.log("Cliente desconectado:", reason)
        })

        client.initialize()
    })
}
