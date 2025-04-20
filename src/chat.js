const opcoes = {
    1: "📊 *Tabela de Preços - Brito’s Locações:*\n\n🛵  O valor varia de R$ 250 á R$ 300/semana dependendo do modelo da moto. Catálogo  disponível no perfil do Whatsapp!\n\n",
    2: "📝 *Como funciona o aluguel das motos:*\n\n✔️ Na Brito’s Locações, você pode alugar uma moto tanto para trabalhar quanto para uso pessoal. O processo é simples, rápido e com toda a documentação feita de forma segura...",
    3: "🗂️ *Para locar a moto é necessário:* \n\n- Caução 500R$ -Esse valor, será devolvido no prazo maximo de 7 dias úteis após a devolução caso devolva a motocicleta da mesma forma que recebeu.( sem multas, avarias, semana em aberto, etc.\n- CNH (Categoria A com/EAR)\n- Aceitar no app a indicação de principal condutor\n- Local seguro pra guardar a moto\n- Contato de duas pessoas próximas\n- Comprovante de residência\n\n🔒 Todos os dados são protegidos.",
    4: "✅ Incluso na locação:\n\n- IPVA\n- Seguro\n- Manutenção\n- Acessórios\n- Troca de peças por desgaste do dia a dia.",
    5: "📌 Responsabilidades do Locatário:\n\n- Trocar o óleo a cada 1.000 km\n- Trocar o filtro de óleo a cada 2.000 km (comprovar com foto datada)\n- Troca de peças por mau uso\n- Acidentes\n- Manter a moto em bom estado de conservação.",
    6: "📍Instagram da loja: https://www.instagram.com/britos_locacoes.moto?igsh=OGQwa3N3NDhrbHE3\n\nCaso tenha outras dúvidas, continue por aqui ou fale direto com nossa equipe.",
    7: "💰Financeiro \n\n Pix para pagamento telefone: 81997236676 \n Nome: Ney de Andrade Brito \n Banco: Picpay \n\n 💳 Cartão de crédito "
}

const saudacoes = [
    "oi",
    "Olá",
    "olá",
    "ola",
    "opa",
    "yo",
    "boa",
    "boa tarde",
    "boa noite",
    "bom dia"
]

const menuLiberado = {}
const usuariosAtivos = {}
const conversasEncerradas = {}

const TEMPO_LIMITE = 5 * 60 * 1000

function esperar(ms) {
    return new Promise((res) => setTimeout(res, ms))
}

async function simularDigitando(msg) {
    const chat = await msg.getChat()
    await chat.sendStateTyping()
    await esperar(2000)
}

function agendarEncerramento(client, numero) {
    if (usuariosAtivos[numero]) {
        clearTimeout(usuariosAtivos[numero])
    }

    usuariosAtivos[numero] = setTimeout(async () => {
        await client.sendMessage(
            numero,
            "⏱️ Encerramos esta conversa por inatividade. Se ainda precisar de ajuda, digite *menu* para reiniciar o atendimento."
        )
        delete usuariosAtivos[numero]
        conversasEncerradas[numero] = true
        delete menuLiberado[numero]
    }, TEMPO_LIMITE)
}

function montarMenu() {
    return (
        "📋 *Menu Principal - Brito’s Locações:*\n\n" +
        "1️⃣ - Ver tabela de preços\n" +
        "2️⃣ - Entenda como funciona a locação\n" +
        "3️⃣ - Requisitos para locação\n" +
        "4️⃣ - O que está incluso na locação\n" +
        "5️⃣ - Responsabilidades do Locatário \n" +
        "6️⃣ - Instagram da Loja\n" +
        "7️⃣ - Financeiro\n\n" + 
        "Digite o número da opção desejada."
    )
}

export async function processarMensagem(client, msg) {
    const texto = msg.body.trim().toLowerCase()
    const numero = msg.from

    console.log("Mensagem recebida:", { numero, texto })

    // Verifica se a mensagem é uma saudação
    if (saudacoes.includes(texto)) {
        menuLiberado[numero] = true
        await simularDigitando(msg)
        await client.sendMessage(
            numero,
            "👋 Olá! Seja bem-vindo(a) à *Brito’s Locações*! \n\n" + montarMenu()
        )
        return
    }

    // Verifica se a conversa foi encerrada
    if (conversasEncerradas[numero]) {
        if (texto !== "menu") {
            await client.sendMessage(
                numero,
                "🚫 A conversa anterior foi encerrada. Digite *menu* para começar novamente."
            )
            return
        }

        delete conversasEncerradas[numero]
    }

    agendarEncerramento(client,numero)

    // Se digitou 'menu', libera as opções
    if (texto === "menu") {
        menuLiberado[numero] = true
        await simularDigitando(msg)
        await client.sendMessage(numero, montarMenu())
        return
    }

    const textoNumerico = texto.replace(/\D/g, "")
    const ehNumero = /^[1-7]$/.test(textoNumerico)

    if (textoNumerico && menuLiberado[numero]) {
        if (opcoes[textoNumerico]) {
            await simularDigitando(msg)
            const resposta = opcoes[textoNumerico]
            await client.sendMessage(
                numero,
                `${resposta}\n\nDigite *menu* para voltar ao menu principal.`
            )
        } else {
            await simularDigitando(msg)
            await client.sendMessage(
                numero,
                "❌ *Opção inválida.*\n\nDigite *menu* para ver as opções disponíveis."
            )
        }
        return
    }

    // Mensagem padrão caso nada se encaixe
    await client.sendMessage(
        numero,
        "🤖 Não entendi sua mensagem. Por favor, digite *menu* para ver as opções disponíveis."
    )
}
