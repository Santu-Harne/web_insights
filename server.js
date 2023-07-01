require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')
const { StatusCodes } = require('http-status-codes')

//port 
const PORT = process.env.PORT || 7000

//creating app instance using express server
const app = express()

//body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// route module
const urlRoute = require('./route/urlRoute')

// assigning route module to primary route
app.use('/urls', urlRoute)

// static files
app.use(express.static(path.join(__dirname, './client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

//default route
app.all('*', (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({ msg: "The Request route path not found" })
})

// function to run the server
const start = async () => {
    try {
        // server listening to given port number
        app.listen(PORT, () => {
            console.log(`server is listening @ http://localhost:${PORT}`);
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
    }
}
start()