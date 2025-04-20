import qrcode from "qrcode-terminal"
import { default as whatsapp } from "whatsapp-web.js"

import { processarMensagem } from "./chat.js"

const client = new whatsapp.Client({
    authStrategy: new whatsapp.LocalAuth(), // Salva a sessão para evitar reescanear o QR
    puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    }
})

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true })
})

client.on("ready", () => {
    console.log(
        "✅ WhatsApp conectado com sucesso! Bot da Brito’s Locações está ativo."
    )
})

client.on("message", async (msg) => {
    processarMensagem(client, msg)
})

client.initialize()
