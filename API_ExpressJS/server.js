const express = require('express')
const http = require('http')
const { Server } = require("socket.io")
const mongoose = require('mongoose')
const Logger = require('./src/Logger')
const cors = require('cors');

 mongoose
        .connect('mmongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb')
           .then(() => {console.log("réussi")})
           .catch(() => {console.log("error")})


const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(cors({
    origin: '*'
}));


const { body, validationResult } = require('express-validator')

const { Article } = require('./src/Schemas/Article')
const { Request } = require('./src/Schemas/Request')
const { Message } = require('./src/Schemas/Message')

app.use(express.json())
app.use('/src', express.static(__dirname + '/src'))

app.get('/api/article', async (req, res) => {
    Logger.infoRequest(req)

    const articles = await Article.find()
    console.log(articles)

   // res.send(articles)
})

app.get('/api/index', async (req, res) => {
    res.redirect(__dirname + "/index.html")
})

app.get('/api/article/:article', async (req, res) => {
    Logger.infoRequest(req)

    try {
        const article = await Article.findById(req.params.article)

        res.send(article)
    } catch {
        res.status(404)
		res.send({ error: "Post doesn't exist!" })
    }
})

// Modifie un article
app.put('/api/article/:article', async (req, res) => {
    Logger.infoRequest(req)

    try {
        article =  Article.findById(req.params.article)
        if(article != null) {
            article.title =  req.body.title
            article.content = req.body.content
            await article.updateOne()
        }
        await article.save()
        res.status(200)
        res.send(article)

    } catch {
        res.status(404)
        res.send({ error: "put doesn't exist!" })
    }
})

// delete un article
app.delete('/api/article/:article', async (req, res) => {
    Logger.infoRequest(req)

    try {
        article = rticle.findById(req.params.article)
        if(article != null){
           ar =  await article.deleteOne()
            console.log(ar)
            res.status(204)
            console.log("Article supprimé")
        }

    } catch {
        res.status(404)
        res.send({ error: "put doesn't exist!" })
    }
})



app.post(
    '/api/article',

    body('title').isString().isLength({min: 5}), // rules for validation
    body('content').isString().isLength({min: 10}), // too

    async (req, res) => {
        Logger.infoRequest(req)

        // validate user request body
        const errors = validationResult(req)

        try {
            // Throw when validation errors in the body
            errors.throw()
        } catch {
            // Catch errors and send validation errors to the client
            return res.status(400).json({ errors: errors.array() })
        }

        const article = new Article({
            title: req.body.title,
            content: req.body.content,
        })

        await article.save()

        res.send(article)
    }
)

app.get('/', async (req, res) => {
    Logger.infoRequest(req)

    const request = new Request({
        ip: req.ip,
        path: req.path,
        hostname: req.hostname,
        lang: req.acceptsLanguages()
    })

    request.save().then(() => Logger.debug('[MONGOOSE] request saved ' + request._id))

    res.sendFile(__dirname + '/resources/view/index.html')
})

app.get('/chat', async (req, res) => {
    Logger.infoRequest(req)

    const request = new Request({
        ip: req.ip,
        path: req.path,
        hostname: req.hostname,
        lang: req.acceptsLanguages()
    })

    request.save().then(() => Logger.debug('[MONGOOSE] request saved ' + request._id))

    res.sendFile(__dirname + '/resources/view/chat.html')
})

io.on('connection', async (socket) => {
    Logger.debug('[IO] new socket connection ' + socket.id)

    const messages = await Message.find({
            'date': { 
                $exists: true 
            }
        })
        .limit(10)
        .sort('-date')

        Logger.debug('[MONGOOSE] retrieved ' + messages.length + ' messages from database for socket ' + socket.id)
        
        messages.forEach((message) => {
            Logger.debug('[IO] send message to ' + socket.id + 'socket from ' + message.socket + ' socket')

            socket.emit("chat message", {
                username: message.username,
                message: message.chat || message.message,
            })
        })

    socket.on('chat message', value => {
        Logger.debug('[IO] new message from ' + socket.id + ' socket')

        const message = new Message({
            username: value.username,
            message: value.message,
            date: Date.now(),
            socket: socket.id,
            ip: socket.handshake.address,
            headers: socket.request.headers
        })

        message.save()
            .then(() => Logger.debug('[MONGOOSE] message saved ' + message._id))

        socket.broadcast.emit('chat message', message)
    })

    socket.on('disconnect', () => {
        Logger.debug('[IO] socket disconnected ' + socket.id)
    })
})

server.listen(5000, () => {
    Logger.info('[HTTP] Server start on port 5000')
})
