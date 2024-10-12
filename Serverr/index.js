import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import cors from 'cors'
import { admin } from './Routess/Admin.js'
import { EmployeeRoute } from './Routess/EmployeeRoute.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'




const app = express()
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use('/auth', admin)
app.use(express.static('public'))
app.use('/employee', EmployeeRoute)


app.listen(3032, () => {
    console.log('server is running')
})

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.KEY, (err, decoded) => {
            if (err) return res.json({ status: false, Error: 'wrong token' })
            req.id = decoded.id;
            req.role = decoded.role;
            next()
        })
    } else {
        return res.json({ status: false, Error: 'not autenticated' });
    }
}

app.get('/verify', verifyUser, (req, res) => {
    return res.json({Status: true , role:req.role, id:req.id})

})
