const express = require("express")
const server = express()

//pegar o banco de dados
const db = require("./database/db")

//config pasta public
server.use(express.static("public"))

//habilitar  o uso do req.body na application
server.use(express.urlencoded({extended: true}))


//ultilizando template.engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express:server,
    noCache:true
})


//configurar caminho da aplicacao
//pagina inicial
//req : requisição / res: resposta
server.get("/", (req, res) => {
    return res.render("index.html", {title: "Um titulo"})
})

server.get("/create-point", (req, res) => {
    
    //req.query: Query String da URL
    // console.log(req.query)
    return res.render("create-point.html")
})
server.post("/savepoint", (req, res) =>{

    //req.body- corpo do formulario
    // console.log(req.body)

    const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (?,?,?,?,?,?,?);`
const values = [ 
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items,
]
    function afterInsertData(err){
        if(err) {
            return console.log(err)
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.send("ok")
    }

        db.run(query, values, afterInsertData)


       

})


server.get("/search-results", (req, res) => {

    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length

        //mostrar a pag html com os dados do banco de dados
        return res.render("search-results.html", { places: rows, total})
    })

    
})


//ligar o servidor
server.listen(3000)

