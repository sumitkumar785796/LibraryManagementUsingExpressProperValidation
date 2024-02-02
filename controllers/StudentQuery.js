const db = require('../utils/db')
const { validationResult, body } = require('express-validator');

const validationRules = [
    body('student_name').isLength({min:5}).withMessage('Student name must be at least 5 characters').notEmpty().withMessage('Student name is required'),
    body('student_class').notEmpty().withMessage('Student class is required'),
    body('mobile').notEmpty().withMessage('Mobile is required').isMobilePhone().withMessage('Invalid mobile phone number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
const insertStudentRecord = async (req,res) =>{
    try {
        // Run validation rules
        await Promise.all(validationRules.map((validationRule) => validationRule.run(req)));

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {student_name, student_class ,mobile,password}=req.body
        console.log(student_name, student_class ,mobile,password)
        const insertQuery="insert into students(student_name, class ,mobile,password)values(?,?,?,?)"
        const [row,field] = await db.execute(insertQuery,[student_name, student_class ,mobile,password])
        res.status(201).json({message:'Student new record successfully created...',view:row})
    } catch (error) {
        res.status(500).json({message:'Internal server error'})
    }
}
const viewStudentRecords = async (req,res) =>{
    try {
        const viewQuery = "select * from students"
        const [row,field]=await db.execute(viewQuery)
        res.status(200).json({message:row})
    } catch (error) {
        res.status(500).json({message:'Internal server error'})
    }
}
const updateStudentRecord = async (req,res)=>{
    try {
        // Run validation rules
        await Promise.all(validationRules.map((validationRule) => validationRule.run(req)));

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {id}=req.params
        const {student_name, student_class ,mobile,password}=req.body
        const updateQuery="update students set student_name=?, class=?, mobile=?, password=? where stud_id=?"
        const [row,field] =await db.execute(updateQuery,[student_name, student_class ,mobile,password,id])
        res.status(200).json({message:'Update student record successfully...',view:row})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'}) 
    }
}
const deleteStudentRecord = async (req,res)=>{
    try {
        const {id}=req.params
        const deleteQuery="delete from students where stud_id=?"
        const [row,field] = await db.execute(deleteQuery,[id])
        res.status(200).json({message:`Student ${id} is deleted...`,view:row})
    } catch (error) {      
        res.status(500).json({message:'Internal server error'}) 
    }
}
module.exports={insertStudentRecord,viewStudentRecords,updateStudentRecord,deleteStudentRecord}