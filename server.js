const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//For a proper app, I would use Redis for this. I'll use a local cache instead for the demo.
const cache = {
	'messages':[]
}

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	cors: {
		origins: [
				"http://localhost:3000"
			],
		methods: ["GET", "POST"]
	}
});

io.on('connection', () => {
    console.log('user connected');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/messages', (req, res) => {
    res.send(cache.messages);
});

app.post('/messages', (req, res) => {
    const message = {
        user: req.body.user,
        text: req.body.text,
        date: Date.now()
    }
    cache.messages.push(message);
    io.emit('message', message);
    res.sendStatus(200);
});

server.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});

app.use(express.static(__dirname));