import express from "express"

import { prepararConexaoWhatsapp } from "./client.js"

const app = express()

const port = 3000

app.get("/whatsapp", async (req, res) => {
    try {
        const qrCode = await prepararConexaoWhatsapp()
        res.setHeader("Content-Type", "image/png")
        qrCode.pipe(res)
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

app.listen(port, () => {
    console.log(`:::: ✅ Server running at http://localhost:${port}...`)
})
