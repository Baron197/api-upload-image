const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const port = 1997

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req,res) => {
    res.status(200).send('<h1>API Aktif!</h1>')
})

const { postsRouter } = require('./routers')

app.use('/post', postsRouter)

app.listen(port, () => console.log(`API aktif di port ${port}`))