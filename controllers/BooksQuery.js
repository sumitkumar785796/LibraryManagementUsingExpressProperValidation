const db = require('../utils/db')
const { validationResult, body } = require('express-validator');

const validationRules = [
    body('book_name').notEmpty().withMessage('Book name is required'),
    body('student_class').notEmpty().withMessage('Student class is required'),
    body('department').notEmpty().withMessage('Mobile is required')
];
const insertbookRecord = async (req,res) =>{
    try {
        // Run validation rules
        await Promise.all(validationRules.map((validationRule) => validationRule.run(req)));

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {book_name , department, student_class }=req.body
        const insertQuery="insert into books (book_name , department,class)values(?,?,?)"
        const [row,field] = await db.execute(insertQuery,[book_name , department, student_class])
        res.status(201).json({message:'Book new record successfully created...',view:row})
    } catch (error) {
        res.status(500).json({message:'Internal server error'})
    }
}
const viewbookRecords = async (req,res) =>{
    try {
        const viewQuery = "select * from books"
        const [row,field]=await db.execute(viewQuery)
        res.status(200).json({message:row})
    } catch (error) {
        res.status(500).json({message:'Internal server error'})
    }
}
const updateBookRecord = async (req,res)=>{
    try {
        // Run validation rules
        await Promise.all(validationRules.map((validationRule) => validationRule.run(req)));

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {id}=req.params
        const {book_name , department, student_class}=req.body
        const updateQuery="update books set book_name=? , department=?,class=? where book_id =?"
        const [row,field] =await db.execute(updateQuery,[book_name , department, student_class,id])
        res.status(200).json({message:'Update book record successfully...',view:row})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'}) 
    }
}
const deleteBookRecord = async (req,res)=>{
    try {
        const {id}=req.params
        const deleteQuery="delete from books where book_id=?"
        const [row,field] = await db.execute(deleteQuery,[id])
        res.status(200).json({message:`book ${id} is deleted...`,view:row})
    } catch (error) {      
        res.status(500).json({message:'Internal server error'}) 
    }
}
module.exports={insertbookRecord,viewbookRecords,updateBookRecord,deleteBookRecord}