const route = require('express').Router()
const urlController = require('../controller/urlController')

// route to get all insights
route.get('/getAll', urlController.getAll)
// route to add web insights to the database
route.post('/scrapUrl', urlController.scrapUrl)
// route to update web insights as favorite
route.put('/addFev', urlController.addFev)
// route to delete web insights from the database
route.delete('/deleteUrl/:id', urlController.deleteUrl)

module.exports = route