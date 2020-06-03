const express = require("express")
const nunjucks = require("nunjucks")

const server = express()

server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))

nunjucks.configure("src/app/views", {
    express: server,
    noCache: true,
})

// conexão com banco de dados
const { Pool } = require('pg')
const db = new Pool({
    user: 'postgres', // default user
    password: '0000', // altere com sua senha do postgres
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

server.get("/", function (req, res) {
    db.query("SELECT * FROM donors", function (err, result) {
        if (err) return res.send("Eeeeeeeepa! Erro no banco de dados!")

        const donors = result.rows
        res.render("index.html", { donors })
    })
})

server.post("/", function (req, res) {
    // dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    // validação
    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios")
    }

    // add valores no banco de dados
    const query =
        `INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function (err) {
        if (err) return res.send("erro no banco de dados.")

        return res.redirect("/")
    })

})

server.listen(3000, function () {
    console.log('Servidor ligado! Acesse http://localhost:3000 no seu navagador.')
})