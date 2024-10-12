import mysql from 'mysql'


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employems'
})

con.connect((err)=> {
        if(err) {
            console.log('error')
        }else {
            console.log('connected')
        }
})
export default con