const express = require ('express')
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')

const db = require('./dbconnect/db')

const app = express ()
const port = 5600

app.set('view engine', 'hbs')
app.use('/assets', express.static(__dirname + '/assets'))

app.use(flash())

app.use(
    session({
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 2
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: 'secretValue'
    })
)

app.use(express.urlencoded({extended: false}))

let isLogin = true

app.get ('/', function (request, response) {

    let selectQuery = ''
    if (request.session.isLogin) {
        selectQuery = `SELECT tb_projects.*, tb_users.*
                        FROM tb_projects
                        INNER JOIN tb_users
                        ON tb_projects."authorID" = tb_users.id
                        WHERE tb_projects."authorID" = ${request.session.user.id}
                        ORDER BY id DESC`
    } else {
        selectQuery = `SELECT tb_projects.*, tb_users.*
                        FROM tb_projects
                        INNER JOIN tb_users
                        ON tb_projects."authorID" = tb_users.id
                        ORDER BY id DESC`
    }
    db.connect((err,client,done)=>{
        if(err) {
            return response.redirect('/contact-me')
        }

        let selectQuery = 'SELECT * FROM tb_projects;'

        client.query(selectQuery, (err,result) =>{
            if(err) throw err

            let dataProject = result.rows

            dataProject = dataProject.map((item) =>{
                return {
                    ...item,
                    isLogin,
                    author: 'Irham Fatriyand',
                    isLogin: request.session.isLogin,
                    user: request.session.user,
                    duration: getDuration(new Date())
                }
            })

            response.render ('index' , {dataProject, isLogin: request.session.isLogin, user: request.session.user})
        })
    })

}) 

app.get ('/project-detail/:id', function (request, response) {
    let id = request.params.id

    
    db.connect((err,client,done)=>{
        if(err) {
            return response.redirect('/contact-me')
        }

        let detailQuery = `SELECT * FROM tb_projects WHERE id=${id}`

        client.query(detailQuery, (err,result) =>{
            if(err) throw err

            let data = result.rows

            let dataProject = data.map((item) =>{
                return {
                    ...item,
                    isLogin,
                    author: 'Irham Fatriyand',
                    start_date: getFullTime(item.start_date),
                    end_date: getFullTime(item.end_date),
                    isLogin: request.session.isLogin,
                    user: request.session.user,
                    duration: getDuration()
                }
            })

            response.render ('project-detail', {isLogin: request.session.isLogin, user: request.session.user, data:dataProject[0]})
        })
    })

})

app.get ('/project', function (request, response) {

    let isLogin = request.session.isLogin
    if (!isLogin) {
        return response.redirect('/')
    }
    response.render ('project', {isLogin})
})

app.post ('/project', function(request, response) {

    let { inputTitle: name, startDate: start_date, endDate: end_date, inputContent: description, checkedValue: technologies, imageContent: image } = request.body

    db.connect((err,client,done)=>{
        if(err) {
            return response.redirect('/contact-me')
        }

        let postQuery = `INSERT INTO tb_projects (name, start_date, end_date, description, image) 
                            VALUES ('${name}','${start_date}','${end_date}','${description}','${image}')`

        client.query(postQuery, (err,result) =>{
            done()
            if(err) throw err

            response.redirect ('/')
        })
    })
})

app.get ('/update/:id', function (request, response) {
    let isLogin = request.session.isLogin
    if (!isLogin) {
        return response.redirect('/')
    }

    let id = request.params.id

    db.connect((err,client,done)=>{
        if(err) {
            return response.redirect('/contact-me')
        }

        let delQuery = `SELECT * FROM tb_projects WHERE id=${id}`

        client.query(delQuery, (err,result) =>{
            if(err) throw err

            let data = result.rows

            let dataProject = data.map((item) =>{
                return {
                    ...item,
                    isLogin,
                    author: 'Irham Fatriyand',
                    duration: getDuration()
                }
            })

            response.render ('update', {isLogin, data:dataProject[0]})
        })
    })
    
})

app.post('/update/:id', function(request, response){
    
    let { id, inputTitle: name, startDate: start_date, endDate: end_date, inputContent: description, checkedValue: technologies, imageContent: image } = request.body
    
    db.connect((err,client,done)=>{
        if(err) {
            return response.redirect('/contact-me')
        }

        let updateQuery = `UPDATE tb_projects
        SET name='${name}', start_date='${start_date}', end_date='${end_date}', description='${description}', image='${image}'
        WHERE id=${id}`

        client.query(updateQuery, (err,result) =>{
            if(err) throw err
        
            response.redirect ('/')
        })
    
    })
})

app.get('/delete/:id', function(request, response) {
    let isLogin = request.session.isLogin
    if (!isLogin) {
        return res.redirect('/')
    }

    let id = request.params.id
    let delQuery = `DELETE FROM tb_projects WHERE id=${id}`

    db.connect((err,client,done)=>{
        if(err) {
            return response.redirect('/contact-me')
        }

        client.query(delQuery, (err,result) =>{
            if(err) throw err

            response.redirect('/')
        })
    })

    
})

app.get ('/register', function (request, response) {
    response.render ('register')
})

app.post ('/register', function (request, response) {
    let { name, email, password } = request.body

    password = bcrypt.hashSync(password, 10);

    let checkQuery = `SELECT * FROM "tb_users" WHERE email='${email}'`

    let query = `INSERT INTO tb_users (name, email, password) 
                VALUES  ('${name}', '${email}', '${password}')`

    db.connect ((err, client, done)=> {
        if(err) {
            return response.redirect('/contact-me')
        }

        client.query(checkQuery, (err, result) => {
            if (err) throw err

            if (result.rowCount != 0) {
                return response.redirect('/register')
            }

            client.query(query, (err,result) =>{
                done()
                if(err) throw err
    
                response.redirect('/login')
            })
        })

    })

})

app.get ('/login', function (request, response) {
    response.render ('login')
})

app.post('/login', function (request, response) {
    let { email, password } = request.body

    db.connect((err, client, done) => {
        if (err) throw err

        let checkQuery = `SELECT * FROM "tb_users" WHERE email='${email}'`

        client.query(checkQuery, (err, result) => {
            if (err) throw err

            if (result.rowCount == 0) {
                request.flash('danger', 'email not found')

                return response.redirect('/login')
            }

            let isMatch = bcrypt.compareSync(password, result.rows[0].password)

            if (isMatch) {
                request.session.isLogin = true
                request.session.user = {
                    name: result.rows[0].name,
                }
                request.flash('success', 'login success')
                response.redirect('/')
            } else {
                request.flash('danger', 'email and password doesnt match')

                response.redirect('/login')
            }

        })
    })
})

app.get('/logout', function (request, response) {
    request.session.destroy()
    response.redirect('/')
})

app.get ('/contact-me', function (request, response) {
    let isLogin = request.session.isLogin
    if (!isLogin) {
        return response.redirect('/')
    }

    response.render ('contact-me', {isLogin})
})



function getFullTime(time) {

    let month = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    let date = time.getDate()
    let monthIndex = time.getMonth()
    let year = time.getFullYear()

    let hours = time.getHours()
    let minutes = time.getMinutes()

    if (hours < 10) {
        hours = "0" + hours
    } else if (minutes < 10) {
        minutes = "0" + minutes
    }


    let fullTime = `${date} ${month[monthIndex]} ${year}`

    return fullTime
}

function getDuration(start_date, end_date){
    
    var timeStart = new Date(start_date)
    var timeEnd = new Date(end_date)

    var distance = Math.abs(timeEnd.getTime() - timeStart.getTime())

    let monthDistance = Math.floor(distance / (30 * 24 * 60 * 60 * 1000))
    if (monthDistance != 0) {
        return monthDistance + ' month'
    } else {
        let weekDistance = Math.floor(distance / (7 * 24 * 60 * 60 * 1000))
        if (weekDistance != 0) {
            return weekDistance + ' week'
        } else {
            let daysDistance = Math.floor(distance / (24 * 60 * 60 * 1000))
            if (daysDistance != 0) {
                return daysDistance + ' day'
            } else {
                let hoursDistance = Math.floor(distance / (60 * 60 * 1000))
                if (hoursDistance != 0) {
                    return hoursDistance + ' hour'
                } else {
                    let minuteDistance = Math.floor(distance / (60 * 1000))
                    if (minuteDistance != 0) {
                        return minuteDistance + ' minute'
                    } else {
                        let secondDistance = Math.floor(distance / 1000)
                        if (secondDistance != 0)
                        return secondDistance + ' sec'
                    }
                }
            }
        }
    }
}

app.listen(port, function () {
    console.log(`Server running on port : ${port}`);
})