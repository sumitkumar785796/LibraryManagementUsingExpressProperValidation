const express = require('express')
const routes = express.Router()
const studentlink = require('../controllers/StudentQuery')
const booklink = require('../controllers/BooksQuery')
const bookissuelink = require('../controllers/BookIssueQuery')
//students crud 
routes.route('/studinsert').post(studentlink.insertStudentRecord)
routes.route('/studview').get(studentlink.viewStudentRecords)
routes.route('/studupdate/:id').post(studentlink.updateStudentRecord)
routes.route('/studdel/:id').get(studentlink.deleteStudentRecord)
//book crud
routes.route('/bookinsert').post(booklink.insertbookRecord)
routes.route('/bookview').get(booklink.viewbookRecords)
routes.route('/bookupdate/:id').post(booklink.updateBookRecord)
routes.route('/bookdelet/:id').get(booklink.deleteBookRecord)
//book issue details cru
routes.route('/bookissueinsert').post(bookissuelink.insertBookissueRecord)
routes.route('/bookissueview').get(bookissuelink.viewBookissueRecords)
routes.route('/bookissueupdate/:id').post(bookissuelink.updateBookissueRecord)
module.exports=routes