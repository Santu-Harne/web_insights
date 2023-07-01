const mongoose = require('mongoose')
const assert = require('assert')

// connecting mongoDB database using mongoose
const connect = mongoose.createConnection(process.env.MONGO_URL, (err) => {
    if (err) assert.deepStrictEqual(err, null)
    console.log('mongoDB connected successfully');
})

// creating mongoDB Schema
const URLSchema = connect.model('URLs', new mongoose.Schema({
    domain_name: {
        type: String,
        required: true,
    },
    word_count: {
        type: Array,
    },
    favorite: {
        type: String,
        default: "false"
    },
    web_links: {
        type: Array
    },
    media_links: {
        type: Array
    }
}, {
    collection: 'url_collection',
    timestamps: true
}))

module.exports = URLSchema