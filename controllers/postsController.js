const conn = require('../database')

module.exports = {
    getPosts: (req,res) => {
        var sql = `Select * from posts;`;
        conn.query(sql, (err,result) => {
            if(err) res.status(500).send({ message: 'Error!', error: err})

            res.status(200).send(result)
        })
    },
    addPost: (req,res) => {

    }
}