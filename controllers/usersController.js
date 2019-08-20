const conn = require('../database')
const Crypto = require('crypto')
const transporter = require('../helpers/mailer')
const { createJWTToken } = require('../helpers/jwt')

module.exports = {
    register: (req,res) => {
        var { username, password, email } = req.body;
        var sql = `SELECT username from users WHERE username='${username}'`;
        conn.query(sql, (err,results) => {
            if(err) {
                return res.status(500).send({ status: 'error', err })
            }

            if(results.length > 0) {
                return res.status(200).send({ status: 'error', message: 'Username has been taken!'})
            }
            else {
                var hashPassword = Crypto.createHmac("sha256", "puripuriprisoner")
                                        .update(password).digest("hex");
                var dataUser = { 
                    username, 
                    password: hashPassword,
                    email,
                    status: 'Unverified',
                    lastlogin: new Date()
                }
                sql = `INSERT into users SET ? `;
                conn.query(sql,dataUser,(err1, results1) => {
                    if(err1) {
                        return res.status(500).send({ status: 'error', err: err1 })
                    }

                    var linkVerifikasi = `http://localhost:3000/verified?username=${username}&password=${hashPassword}`;
                    var mailOptions = {
                        from: 'Penguasa Instagrin <baronhartono@gmail.com>',
                        to: email,
                        subject: 'Verifikasi Email untuk Instagrin',
                        html: `Tolong click link ini untuk verifikasi : 
                                <a href="${linkVerifikasi}">Join Instagrin!</a>`
                    }

                    transporter.sendMail(mailOptions, (err2,res2) => {
                        if(err2) { 
                            console.log(err2) 
                            return res.status(500).send({ status: 'error', err: err2 })
                        }
                        
                        console.log('Success!')
                        return res.status(200).send({ username, email, status: 'Unverified' })
                    })
                })
            }
        })
    },
    emailVerifikasi: (req,res) => {
        var { username, password } = req.body;
        var sql = `Select username,email from users where username='${username}'`;
        conn.query(sql, (err,results) => {
            if(err) return res.status(500).send({ status: 'error', err })

            if(results.length === 0) {
                return res.status(500).send({ status: 'error', err: 'User Not Found!'})
            }

            sql = `Update users set status='Verified' where username='${username}' and password='${password}'`
            conn.query(sql, (err,results1) => {
                if(err) return res.status(500).send({ status: 'error', err })

                res.status(200).send({ username: results[0].username, email: results[0].email, status: 'Verified' })
            })
        })
    },
    resendEmailVer: (req,res) => {
        var { username, email } = req.body;

        var sql = `Select username,password,email from users where username='${username}' and email='${email}'`
        conn.query(sql, (err,results) => {
            if(err) return res.status(500).send({ status: 'error', err })

            if(results.length === 0) {
                return res.status(500).send({ status: 'error', err: 'User Not Found!'})
            }

            var linkVerifikasi = `http://localhost:3000/verified?username=${results[0].username}&password=${results[0].password}`;
            var mailOptions = {
                from: 'Penguasa Instagrin <baronhartono@gmail.com>',
                to: results[0].email,
                subject: 'Verifikasi Email untuk Instagrin',
                html: `Tolong click link ini untuk verifikasi : 
                        <a href="${linkVerifikasi}">Join Instagrin!</a>`
            }

            transporter.sendMail(mailOptions, (err2,res2) => {
                if(err2) { 
                    console.log(err2) 
                    return res.status(500).send({ status: 'error', err: err2 })
                }
                
                console.log('Success!')
                return res.status(200).send({ username, email, status: 'Unverified' })
            })
        })
    },
    keepLogin: (req,res) => {
        console.log(req.user)
        var sql = `Select * from users where id=${req.user.userId}`
        conn.query(sql,(err,results) => {
            if(err) return res.status(500).send({ status: 'error', err })

            if(results.length === 0) {
                return res.status(500).send({ status: 'error', err: 'User Not Found!'})
            }

            const token = createJWTToken({ userId: results[0].id, username: results[0].username })

            res.send({ username: results[0].username, email: results[0].email, status: results[0].status, token})
        })
    },
    login: (req,res) => {
        var { username, password } = req.body;
        var hashPassword = Crypto.createHmac("sha256", "puripuriprisoner")
                                .update(password).digest("hex");
        var sql = `Select * from users where username='${username}' and password='${hashPassword}'`;
        conn.query(sql, (err,results) => {
            if(err) return res.status(500).send({ status: 'error', err })

            if(results.length === 0) {
                return res.status(200).send({ status: 'error', message: 'Username or Password Incorrect!'})
            }
            const token = createJWTToken({ userId: results[0].id, username: results[0].username })
            console.log(token)
            return res.status(200).send({ username, email: results[0].email, status: results[0].status, token})
        })
    }
}