const db = require('../utils/db')
const { validationResult, body } = require('express-validator');

const validationRules = [
    body('book_id').notEmpty().withMessage('Book id is required'),
    body('stud_id').notEmpty().withMessage('Student id is required')
];
const insertBookissueRecord = async (req,res) =>{
    try {
        // Run validation rules
        await Promise.all(validationRules.map((validationRule) => validationRule.run(req)));

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {book_id,stud_id}=req.body
        const currentDate = new Date();
        // const dueDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days in milliseconds
        const dueDate = new Date(currentDate.getTime() + 1 * 60 * 1000); // 1 min in milliseconds
        const insertQuery="insert into book_issue_details(book_id,stud_id,due_date) values(?,?,?)"
        const [row,field] = await db.execute(insertQuery,[book_id,stud_id,dueDate])
        res.status(201).json({message:'Successfully new Book issue...',view:row})
    } catch (error) {
        res.status(500).json({message:'Internal server error'})
    }
}
const viewBookissueRecords = async (req,res) =>{
    try {
        const viewQuery = "SELECT book_issue_id , book_name , student_name ,issue_date ,due_date ,return_date,late_fine,is_submmited FROM book_issue_details INNER JOIN students ON book_issue_details.stud_id = students.stud_id INNER JOIN books ON book_issue_details.book_id = books.book_id"
        const [row,field]=await db.execute(viewQuery)
        res.status(200).json({message:row})
    } catch (error) {
        res.status(500).json({message:'Internal server error'})
    }
}
const updateBookissueRecord = async (req,res) => {
    try {
        const {id} = req.params

        const returnDate = new Date()
        const fetchQuery = "SELECT due_date, late_fine FROM book_issue_details WHERE book_issue_id = ?"
        const [fetchResult] = await db.execute(fetchQuery, [id]);
        const { due_date, late_fine } = fetchResult[0];
        // const daysLate = Math.max(0, Math.floor((returnDate - due_date) / (1000 * 60 * 60 * 24)))
        // const additionalFine = daysLate * 10; // Assuming Rs. 10 per day late
        // Calculate late fine based on the return date and due date
        const minutesLate = Math.max(0, Math.floor((returnDate - due_date) / (1000 * 60))); 
        const additionalFine = minutesLate * 10; // Assuming Rs. 10 per minute late
        const totalLateFine = late_fine + additionalFine;
        const updateQuery = "UPDATE book_issue_details SET is_submmited = 1, return_date = ?, late_fine = ? WHERE book_issue_id = ?";
        const [row, field] = await db.execute(updateQuery, [returnDate, totalLateFine, id]);
        res.status(200).json({  message: 'Book returned successfully...', view: row });
    } catch (error) {
        console.error(error);
        res.status(200).json({message: 'Internal server Error' });
    }
  };
    
  
  

module.exports={insertBookissueRecord,viewBookissueRecords,updateBookissueRecord}