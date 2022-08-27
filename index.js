const express = require ('express')

const db = require('./dbconnect/db')

const app = express ()
const port = 5600

app.set ('view engine', 'hbs')
app.use('/assets', express.static(__dirname + '/assets'))
app.use(express.urlencoded({extended: false}))

let isLogin = true

// let dataProject = [
//     {
//         title: 'Programming Nowadays',
//         content: 'Computer programming is the process of performing a particular computation (or more generally, accomplishing a specific computing result), usually by designing and building an executable computer program. Programming involves tasks such as analysis, generating algorithms, profiling algorithms accuracy and resource consumption, and the implementation of algorithms (usually in a chosen programming language, commonly referred to as coding). The source code of a program is written in one or more languages that are intelligible to programmers, rather than machine code, which is directly executed by the central processing unit. The purpose of programming is to find a sequence of instructions that will automate the performance of a task (which can be as complex as an operating system) on a computer, often for solving a given problem. Proficient programming thus usually requires expertise in several different subjects, including knowledge of the application domain, specialized algorithms, and formal logic.',
//         startDate: '11 Juli 2022',
//         endDate: '18 Juli 2022',
//         duration: '1',
//         author: 'Irham Fatriyand',
//         checkedValue: '',
//         image: ''
//     }
// ]

app.get ('/', function (request, response) {

    let selectQuery = 'SELECT * FROM tb_projects;'

    db.connect((err,client,done)=>{
        if(err) {
            return response.redirect('/contact-me')
        }

        client.query(selectQuery, (err,result) =>{
            if(err) throw err

            let dataPro = result.rows

            dataPro = dataPro.map((project) =>{
                return {
                    ...project,
                    isLogin,
                    author: 'Irham Fatriyand',
                    duration: '1 month'
                }
            })

            response.render ('index' , {isLogin, dataProject: dataPro})
        })
    })

    
}) 

app.get ('/register', function (request, response) {
    response.render ('register')
})

app.get ('/login', function (request, response) {
    response.render ('login')
})

app.get ('/contact-me', function (request, response) {
    response.render ('contact-me')
})

app.get ('/project', function (request, response) {
    response.render ('project')
})

app.post ('/project', function(request, response) {
    let title = request.body.inputTitle
    let content = request.body.inputContent
    let startDate = request.body.startDate
    let endDate = request.body.endDate
    let checkedValue = request.body.checkedValue
    // let duration = request.body.duration
    let image = request.body.image

    start = new Date(startDate)
    end = new Date(endDate)

    startDated = start.getMonth()
    endDated = end.getMonth()

    let duration = endDated - startDated

    let project = {
        title,
        content,
        author: "Irham Fatriyand",
        startDate,
        endDate,
        checkedValue,
        duration,
        image
    }

    dataProject.push(project)

    response.redirect('/')
})
 
app.get ('/update/:id', function (request, response) {
    let id = request.params.id

    let data = {
        title: dataProject[id].title,
        content: dataProject[id].content,
        startDate: dataProject[id].startDate,
        endDate: dataProject[id].endDate,
        checkedValue: dataProject[id].checkedValue,
        duration: dataProject[id].duration,
        image: dataProject[id].image
    }
    response.render ('update', {id, data})
})

app.post('/update/:id', function(request, response){

    let id = request.params.id

    dataProject[id].title = request.body.inputTitle
    dataProject[id].content = request.body.inputContent
    dataProject[id].startDate = request.body.startDate
    dataProject[id].endDate = request.body.endDate
    dataProject[id].checkedValue = request.body.checkedValue
    dataProject[id].image = request.body.image
    

    start = new Date(request.body.startDate)
    end = new Date(request.body.endDate)
    
    startDated = start.getMonth()
    endDated = end.getMonth()
    
    let duration = endDated - startDated

    dataProject[id].duration = duration

    response.redirect('/')
})

app.get('/delete/:id', function(request, response) {

    let id = request.params.id

    dataProject.splice(id, 1)

    response.redirect('/')
})

app.get ('/project-detail/:id', function (request, response) {
    let id = request.params.id
    console.log(id);

    let data = dataProject[id]
    data = {
        title: data.title,
        content: data.content,
        duration: data.duration,
        startDate: data.startDate,
        endDate: data.endDate,
        author: data.author,
        checkedValue: data.checkedValue,
        image: data.image
    }

    response.render ('project-detail', {data})
})

function getDuration(start, end){
    
    let timeStart = new Date(start)
    let timeEnd = new Date(end)

    distance = timeEnd - timeStart

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
    return `${finalDur}`
}

app.listen(port, function () {
    console.log(`Server running on port : ${port}`);
})