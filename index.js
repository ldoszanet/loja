// npm init
// npm i dotenv
const dotenv = require("dotenv")
dotenv.config()
// npm i express
const express = require("express")
const app = express()
const port = process.env.API_PORT
app.use(express.json())

// npm i mysql2
const db = require("./db")

// npm i bcrypt
const bcrypt = require("bcrypt")

// npm i jsonwebtoken
const jwt = require("jsonwebtoken")

// npm i cors
const cors = require("cors")
app.use(cors())

const path = require("path")
app.use("/img", express.static(path.join(__dirname, 'img')))
// http://localhost:3000/img/1.jpg

// ===================== CLIENTE =====================

app.post("/cliente", async (req, res) => {
    try {
        const cliente = req.body
        const senhaCript = bcrypt.hashSync(cliente.senha, 10)
        cliente.senha = senhaCript

        const resultado = await db.pool.query(
            `INSERT INTO cliente (
                nome, cpf, celular, email, senha
            ) VALUES ( ?, ?, ?, ?, ? )`,
            [cliente.nome, cliente.cpf, cliente.celular,
             cliente.email, cliente.senha]
        )
        res.status(201).json({
            msg: "Cliente cadastrado, ID = " + resultado[0].insertId
        })
    } catch (error) {
        res.status(500).json({erro: error.message})
    }
})

app.post("/login", async (req, res) => {
    try {
        const user = req.body
        const resultado = await db.pool.query(
            "SELECT id, nome, email, senha FROM cliente WHERE email = ?", [user.email]
        )
        const dados_bd = resultado[0][0]
        if (!dados_bd) {
            return res.status(401).json({msg: "Email não cadastrado!"})
        }

        const senha_valida = await bcrypt.compare(user.senha, dados_bd.senha)

        if (!senha_valida) {
            return res.status(401).json({msg: "Credenciais inválidas!"})
        }

        const payload = {
            id: dados_bd.id,
            email: dados_bd.email
        }
        // aumentei para 2h para os testes não caírem no meio
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' })
        return res.status(200).json({nome: dados_bd.nome, token: token})

    } catch (error) {
        res.status(500).json({erro: error.message})
    }
})

app.get("/cliente/perfil", autenticar, async (req, res) => {
    try {
        const id = req.usuario.id
        const resultado = await db.pool.query("SELECT * FROM cliente WHERE id = ?", [id]);
        const perfil = resultado[0][0]
        delete perfil.senha
        res.status(200).json(perfil)
    } catch (error) {
        res.status(500).json({ erro: 'Erro interno' });
        throw error;
    }
})

// ===================== PRODUTO =====================

app.get("/produto", async (req, res) => {
    try {
        let sql = "SELECT * FROM produto WHERE 1=1"
        const params = []
        // Query Parameter
        const { busca, ordenacao } = req.query
        let resultado
        if (busca) {
            sql += " AND nome LIKE ?"
            params.push(`%${busca}%`)
        }
        if (ordenacao) {
            if (ordenacao == "maior preco") {
                sql += " ORDER BY preco DESC"
            } else {
                sql += " ORDER BY preco ASC"
            }
        }
        resultado = await db.pool.query(sql, params)
        res.status(200).json(resultado[0])
    } catch (error) {
        res.status(500).json({erro: error.message})
    }
})

app.get("/produto/:id", async (req, res) => {
    try {
        // Path Parameter
        const id = req.params.id
        const resultado = await db.pool.query("SELECT * FROM produto WHERE id = ?", [id])
        const produto = resultado[0][0]
        res.status(200).json(produto)
    } catch (error) {
        res.status(500).json({erro: error.message})
    }
})

// ===================== COMPRA (AV3) =====================

// POST /compra -> registra uma compra com um ou vários produtos
// Requer JWT: Authorization: Bearer <token>
// Body: { "itens": [{ "produto_id": 1, "quantidade": 2 }, ...], "status": "pendente" (opcional) }
app.post("/compra", autenticar, async (req, res) => {
    const connection = await db.pool.getConnection()
    try {
        const cliente_id = req.usuario.id        // vem do JWT, nunca do body
        const { itens, status } = req.body

        if (!Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({
                erro: "Envie ao menos um item em 'itens'. Ex.: { itens: [{ produto_id: 1, quantidade: 2 }] }"
            })
        }

        // valida cada item e busca o preço atual no banco
        const itensValidados = []
        for (const item of itens) {
            if (!item.produto_id || !Number.isInteger(item.quantidade) || item.quantidade <= 0) {
                return res.status(400).json({
                    erro: "Item inválido. Use { produto_id: <int>, quantidade: <int > 0> }."
                })
            }
            const [prod] = await connection.query(
                "SELECT id, preco FROM produto WHERE id = ?",
                [item.produto_id]
            )
            if (prod.length === 0) {
                return res.status(404).json({ erro: `Produto ${item.produto_id} não encontrado.` })
            }
            const preco = Number(prod[0].preco)
            const subtotal = Number((preco * item.quantidade).toFixed(2))
            itensValidados.push({
                produto_id: prod[0].id,
                quantidade: item.quantidade,
                preco_unitario: preco,
                subtotal
            })
        }

        const valor_total = Number(
            itensValidados.reduce((acc, i) => acc + i.subtotal, 0).toFixed(2)
        )

        // transação: compra + itens juntos ou nada
        await connection.beginTransaction()

        const [resultCompra] = await connection.query(
            `INSERT INTO compra (cliente_id, valor_total, status)
             VALUES (?, ?, ?)`,
            [cliente_id, valor_total, status || "pendente"]
        )
        const compra_id = resultCompra.insertId

        for (const item of itensValidados) {
            await connection.query(
                `INSERT INTO item_compra
                 (compra_id, produto_id, quantidade, preco_unitario, subtotal)
                 VALUES (?, ?, ?, ?, ?)`,
                [compra_id, item.produto_id, item.quantidade, item.preco_unitario, item.subtotal]
            )
        }

        await connection.commit()
        res.status(201).json({
            msg: "Compra registrada com sucesso",
            compra_id,
            valor_total,
            itens: itensValidados
        })
    } catch (error) {
        try { await connection.rollback() } catch (_) {}
        res.status(500).json({ erro: error.message })
    } finally {
        connection.release()
    }
})

// GET /compra -> lista as compras do cliente logado, com os itens
// Requer JWT: Authorization: Bearer <token>
app.get("/compra", autenticar, async (req, res) => {
    try {
        const cliente_id = req.usuario.id

        const [compras] = await db.pool.query(
            `SELECT id, data_compra, valor_total, status
             FROM compra
             WHERE cliente_id = ?
             ORDER BY data_compra DESC`,
            [cliente_id]
        )

        if (compras.length === 0) {
            return res.status(200).json({ compras: [] })
        }

        const ids = compras.map(c => c.id)
        const [itens] = await db.pool.query(
            `SELECT ic.compra_id, ic.produto_id, p.nome AS produto_nome,
                    ic.quantidade, ic.preco_unitario, ic.subtotal
             FROM item_compra ic
             INNER JOIN produto p ON p.id = ic.produto_id
             WHERE ic.compra_id IN (?)`,
            [ids]
        )

        const comprasComItens = compras.map(c => ({
            ...c,
            itens: itens.filter(i => i.compra_id === c.id)
        }))

        res.status(200).json({ compras: comprasComItens })
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

// GET /compra/:id -> detalhe de uma compra do próprio cliente (extra, opcional)
app.get("/compra/:id", autenticar, async (req, res) => {
    try {
        const cliente_id = req.usuario.id
        const compra_id = req.params.id

        const [compras] = await db.pool.query(
            "SELECT * FROM compra WHERE id = ? AND cliente_id = ?",
            [compra_id, cliente_id]
        )
        if (compras.length === 0) {
            return res.status(404).json({ erro: "Compra não encontrada para este usuário." })
        }

        const [itens] = await db.pool.query(
            `SELECT ic.*, p.nome AS produto_nome
             FROM item_compra ic
             INNER JOIN produto p ON p.id = ic.produto_id
             WHERE ic.compra_id = ?`,
            [compra_id]
        )

        res.status(200).json({ ...compras[0], itens })
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

// ===================== START =====================

app.listen(port, () => {
    console.log("API rodando na porta " + port)
})

// ===================== MIDDLEWARE =====================

function autenticar(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return res.status(401).json({ erro: "Token não enviado, usar Authorization Bearer <token>" })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ erro: "Token inválido" })
        req.usuario = usuario
        next()
    })
}
