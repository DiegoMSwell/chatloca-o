import express from "express"
import { prepararConexaoWhatsapp } from "./client.js"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

let qrCodeStream = null
let clientInicializado = false

app.get("/", (req, res) => {
  res.send("🔥 Bot Brito's Locações está rodando!")
})

app.get("/whatsapp", async (req, res) => {
  try {
    // Evita múltiplas inicializações do cliente
    if (!clientInicializado) {
      qrCodeStream = await prepararConexaoWhatsapp()
      clientInicializado = true
    }

    if (qrCodeStream) {
      res.setHeader("Content-Type", "image/png")
      qrCodeStream.pipe(res)
    } else {
      res.status(400).json({ success: false, message: "QR Code não disponível." })
    }

  } catch (error) {
    console.error("Erro ao gerar QR:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Servidor rodando na porta ${port}...`)
})
