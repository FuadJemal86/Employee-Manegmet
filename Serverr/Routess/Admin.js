import express from 'express'
import con from '../utilss/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import path from 'path'
import multer from 'multer'


const router = express.Router()

router.post('/adminlogin', (req, res) => {
    const sql = 'SELECT * FROM admin WHERE email = ? AND password = ? '
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) return res.json({ loginStates: false, Error: 'quari error' })

        if (result.length > 0) {
            const email = result[0].email
            const token = jwt.sign(
                { role: 'admin', email: email, id:result[0].id }, process.env.KEY , { expiresIn: '40d' }
            )
            res.cookie('token', token)
            return res.json({ loginStates: true })
        } else {
            return res.json({ loginStates: false, Error: 'Worng email or password' })
        }
    })
})

router.get('/catagory', (req, res) => {
    const sql = 'SELECT * FROM catagory'
    con.query(sql, (err, result) => {
        if (err) {
            res.json({ status: false, Error: 'Query Error' })
            return
        } else res.json({ status: true, Result: result })
    })
})


router.post('/add_catagory', (req, res) => {
    const sql = 'INSERT INTO catagory (`name`) VALUES (?)'
    con.query(sql, [req.body.Catagory], (err, result) => {
        if (err) {
            res.json({ status: false, Error: 'Query Error' })
            return
        } else res.json({ status: true })
    })
})

// image uplode

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})

router.post('/add_employee', upload.single('image'), (req, res) => {
    
    if (!req.file) {
        return res.status(400).json({ status: false, Error: 'No file uploaded' });
    }

    const sql = `INSERT INTO employee (name,email,password,salary,address,image,catagory_id) VALUES (?)`;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) return res.json({ status: false, Error: 'Hashing Error' });

        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.salary,
            req.body.address, 
            req.file.filename,  // Handle the image from multer
            req.body.catagory_id
        ]
        
        con.query(sql, [values], (err, result) => {
            if (err) {return res.json({ status: false, Error: err });
        } return res.json({ status: true });
            
        })
    })

})

router.get('/employee',(req,res)=> {
    const sql = 'SELECT * FROM employee'
    con.query(sql, (err, result) => {
        if (err) {
            res.json({ status: false, Error: 'Query Error' })
            return
        } else res.json({ status: true, Result: result })
    })
})

router.get('/employee/:id',(req,res)=> {
    const  id = req.params.id;
    const sql = 'SELECT * FROM employee WHERE id = ?';
    con.query(sql,[id], (err, result) => {
        if (err) res.json({ status: false, Error: 'Query Error' })
        return res.json({ status: true, Result: result })
    })
})

router.put('/update_employee/:id',(req,res) => {
    const  id = req.params.id;
    const sql = `UPDATE employee SET name = ?, email = ?, salary = ?, address = ?, catagory_id = ? WHERE id =?`
    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.catagory_id
    ]
    con.query(sql, [...values,id], (err, result) => {
        if (err) return res.json({ status: false, Error: err });
        return res.json({ status: true });
        
    })
    
})
router.delete('/delete_employee/:id',(req,res)=> {
    const  id = req.params.id;
    const sql = `DELETE FROM employee WHERE id = ?`
    con.query(sql,[id], (err, result) => {
        if (err) res.json({ status: false, Error: 'Query Error' })
        return res.json({ status: true, Result: result })
    })
} )
router.get('/admin_count',(req,res)=>{
    const sql = 'select count(id) as admin from admin'
    con.query(sql, (err, result) => {
        if (err) res.json({ status: false, Error: 'Query Error' })
        return res.json({ status: true, Result: result })
    })
})
router.get('/employee_count',(req,res)=>{
    const sql = 'select count(id) as employee from employee'
    con.query(sql, (err, result) => {
        if (err) res.json({ status: false, Error: 'Query Error' })
        return res.json({ status: true, Result: result })
    })
})
router.get('/salary_count',(req,res)=>{
    const sql = 'SELECT SUM(salary) AS salary FROM employee';
    con.query(sql, (err, result) => {
        if (err) res.json({ status: false, Error: 'Query Error' })
        return res.json({ status: true, Result: result })
    })
})
router.get('/admin_get',(req,res)=>{
    const sql = 'SELECT * FROM admin';
    con.query(sql, (err, result) => {
        if (err) res.json({ status: false, Error: 'Query Error' })
        return res.json({ status: true, Result: result })
    })
})
router.delete('/delete_admin/:id',(req,res)=> {
    const  id = req.params.id;
    const sql = `DELETE FROM employee WHERE id = ?`
    con.query(sql,[id], (err, result) => {
        if (err) res.json({ status: false, Error: 'Query Error' })
        return res.json({ status: true, Result: result })
    })
} )
router.get('/logout',(req,res)=> {
    res.clearCookie('token')
    return res.json({status: true})
})
router.get('/category_id', (req, res) => {
   

    const sql = 'SELECT * FROM catagory';
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

export { router as admin };
