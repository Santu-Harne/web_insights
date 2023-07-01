const { StatusCodes } = require('http-status-codes')
const urlModule = require('url')
const assert = require('assert')
const axios = require('axios')
const URLs = require('../dbModel/urlModel')

const urlController = {
    // controller to get all insights from database
    getAll: async (req, res) => {
        try {
            const allUrl = await URLs.find({})
            res.status(StatusCodes.OK).json({ msg: 'All URLs list', data: allUrl })

        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
        }
    },
    //controller for adding web insights to the database
    scrapUrl: async (req, res) => {
        try {
            const { url } = req.body;
            const newUrl = urlModule.parse(url);
            const domain_name = `${newUrl.protocol}//${newUrl.host}`

            // finding the words count
            const response = await axios.get(url)
            const html = response.data
            const word_count = html.match(/\b\w+\b/g).length;

            const newObj = {
                domain_name,
                word_count: [word_count],
                web_links: [url],
                media_links: [url],
            }

            // checking if present or not
            const present = await URLs.findOne({ domain_name })

            //if not present, then adding as new one
            if (!present) {
                const result = await URLs.insertMany(newObj)
                res.status(StatusCodes.OK).json({ msg: 'Web Insights added successfully', data: result })
            }
            // if present updating the present one
            else {
                const result = await URLs.updateOne({ domain_name },
                    { $push: { "word_count": word_count, "web_links": url, "media_links": url } },
                    { upsert: true })
                res.status(StatusCodes.OK).json({ msg: 'Web Insights updated successfully', data: result })
            }
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
        }
    },
    // controller for adding web insights as favorite
    addFev: async (req, res) => {
        try {
            const { dom_name } = req.body

            const result = await URLs.updateOne({ domain_name: dom_name }, {
                $set: {
                    "favorite": "true"
                }
            })
            res.status(StatusCodes.OK).json({ msg: 'Website added to favorites', data: result })

        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
        }
    },
    // controller for removing web insights from the database
    deleteUrl: async (req, res) => {
        try {
            const id = req.params.id
            const result = await URLs.findOneAndDelete({ _id: id })

            res.status(StatusCodes.OK).json({ msg: 'Web Insights removed successfully' })

        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
        }
    }
}

module.exports = urlController