import express, { response } from 'express'
import con from '../utilss/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const router = express.Router()


router.post('/employee_login', (req, res) => {
    const sql = 'SELECT * FROM employee WHERE email = ? '
    con.query(sql, [req.body.email], (err, result) => {
        if (err) return res.json({ loginStates: false, Error: 'quari error' })

        if (result.length > 0) {
            bcrypt.compare(req.body.password, result[0].password, (err, response) => {
                if (err) return res.json({ loginStates: false, Error: 'Wrong password' })
                if (response) {
                    const email = result[0].email
                    const token = jwt.sign(
                        { role: 'employee', email: email, id : result[0].id }, process.env.KEY, { expiresIn: '40d' }
                    )
                    res.cookie('token', token)
                    return res.json({ loginStates: true, id: result[0].id })
                }
            })

        } else {
            return res.json({ loginStates: false, Error: 'Worng email or password' })
        }
    })
})
router.get('/employee_detail/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM employee WHERE id = ?'
    con.query(sql, [id], (err, result) => {
        if (err) {
            res.json({ status: false, Error: 'Query Error' })
            return
        } else res.json({ status: true, Result: result })

    })
})
router.get('/category_id/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
    console.log(categoryId)

    const sql = 'SELECT * FROM catagory WHERE id = ?';
    con.query(sql, [categoryId], (err, result) => {
        if (err) {
            return res.json({ status: false, Error: 'Query Error' });
        }
        if (result.length > 0) {
            return res.json({ status: true, Result: result });
            
        } else {
            return res.json({ status: false, Error: 'Category not found' });
        }
    });
});

export { router as EmployeeRoute };