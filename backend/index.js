require('dotenv').config()
const express = require('express')
app = express()

const morgan = require('morgan')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const rfs = require('rotating-file-stream');

app.use(express.json())

var accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname, 'log')
})
app.use(morgan('combined', { stream: accessLogStream }))

app.use(cors())
app.use(express.static('dist'))

const resultsRouter = require('./controllers/results')

app.use('/api/results', resultsRouter)

app.get('/', (req, res) => {
  res.send('server running successfully')
})

app.enable('trust proxy');
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
})
