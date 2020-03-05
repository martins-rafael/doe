// configurando servidor
const express = require("express")
const server = express()

// configurando servidor para apresentar arquivos estáticos
server.use(express.static('public'))

// habilitar body formulário
server.use(express.urlencoded({extended: true}))

// configurar conexão com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '!r@afa3L39',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

// configurando apresentação da página
server.get("/", function(req, res) {

    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Eeeeeeeepa! Erro no banco de dados.")
        
        const donors = result.rows
        res.render("index.html", {donors})
    })
})

server.post("/", function(req, res) {
    // pegar dodos do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    // se o name igual a vazio
    // ou o email igual a vazio
    // ou o blood igual a vazio
    if (name == "" || email == "" || blood =="") {
        return res.send("Todos os campos são obrigatórios")
    }

    // add valores no banco de dados
    const query =
    `INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err) {
        // fluxo de erro
        if (err) return res.send("erro no banco de dados.")
        // fluxo ideal
        return res.redirect("/")
    })

})

// ligar servidor e permitir acesso na porta 3000
server.listen(3000, function() {
    console.log('Server On!')
})