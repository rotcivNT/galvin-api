require('dotenv').config()
const connectDB = require('./config/connectDB')
const express = require('express')
const app = express()
const cors = require('cors')
const initApiRoutes = require('./routes/apiRoutes')

const port = process.env.PORT || 6060

app.use(cors())
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

connectDB()

initApiRoutes(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})