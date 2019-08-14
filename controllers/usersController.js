const conn = require('../database')
const Crypto = require('crypto')
const transporter = require('../helpers/mailer')

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
    }
}