const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Crypto = require("crypto");
const bearerToken = require('express-bearer-token');

const port = 1997

const app = express()

app.use(cors())
app.use(bearerToken())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

app.get('/', (req,res) => {
    res.status(200).send('<h1>API Aktif!</h1>')
})

app.get('/testencrypt', (req,res) => {
    var hashPassword = Crypto.createHmac("sha256", "kucingbertasbih")
                            .update(req.query.password).digest("hex");
    console.log(hashPassword);
    res.send(`Panjang= ${hashPassword.length} Password anda ${req.query.password} di encrypt menjadi ${hashPassword}`)
})

const { postsRouter, usersRouter } = require('./routers')

app.use('/post', postsRouter)
app.use('/user', usersRouter)

app.listen(port, () => console.log(`API aktif di port ${port}`))