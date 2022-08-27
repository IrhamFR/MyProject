let projects = []

let addProject = (event) => {
    event.preventDefault()

    const title = document.getElementById("input-project-title").value
    let startProject = document.getElementById("input-start-date").value
    let endProject = document.getElementById("input-end-date").value
    const content = document.getElementById("input-desc-project").value
    let image = document.getElementById("input-project-image").files[0]

    if (image) {
        image = URL.createObjectURL(image)
    }       
    
    checkedValue = [];
    let technology = document.getElementsByClassName('form-check-input');
    let data = technology.length
    for (var i = 0; i < data; i++) {
        if (technology[i].checked == true) {
            checkedValue.push(technology[i].value)
        }
    }

    let project = {
        title,
        startProject,
        endProject,
        content,
        image,
        checkedValue
    }

    projects.push(project)
    console.log(project)
    renderproject()
}

function preview() {
    frame.src = URL.createObjectURL(event.target.files[0]);
}

const renderproject = () => {

    let containerProjects = document.getElementById("project-list-render")

    containerProjects.innerHTML = ""

    for (let i =0; i < projects.length; i++) {
        containerProjects.innerHTML +=`
        <div class="mx-auto">
            <div class="mx-5 mb-5" style="width: 20rem">
                <div class="shadow rounded card">
                    <div class="card-body">
                        <img class="card-img size-img" src="${projects[i].image}" alt="" />
                    </div>
                    <div class="card-body pt-0">
                        <a href="/project-detail" class="card-title text-dark fs-5 fw-bold">${projects[i].title}</a>
                        <p class="text-black-50 pb-0">Duration : ${getDuration(projects[i].startProject, projects[i].endProject)}</p>
                        <p class="text-card m-0">${projects[i].content}</p>
                        <div class="card-body hstack gap-3 text-black-50 ps-0 fs-3">
                            ${(function icon() {
                            let string = ""
                            for (let j = 0; j < projects[i].checkedValue.length; j++) {
                                string += `
                                <div class="bg-transparent">
                                    <i class="${projects[i].checkedValue[j]}"></i>
                                </div>
                                `}

                            return string
                            })()}
                        </div>
                        <div class="row gap-2 m-auto">
                            <a href="#" class="rounded btn btn-dark col">edit</a>
                            <a href="#" class="rounded btn btn-danger border col">delete</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
    }
}

function getDuration(start, end) {
    let proStart = new Date(start)
    let proEnd = new Date(end)

    let distance = proEnd - proStart


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