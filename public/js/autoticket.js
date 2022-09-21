const ticketField = document.querySelector("#title")
const formContainer = document.querySelector(".formContainer")
const viewContainer = document.querySelector("#viewContainer")
const taskButtons = document.querySelectorAll(".btn-check")

const timeSelect = document.querySelector('#timeSelect')
const locationSelect = document.querySelector('#locationSelect')

const buildings = [
    'Building 1',
    'Building 2',
    'Building 3',
    'Building 4',
    'Building 5',
    'Building 8',
    'DC 1',
    'DC 2',
    'Building 9',
    'Building 11',
    'Building 12',
    'Building 13',
    'Building 15',
    'Building 16',
    'Building 0',
    'North Campus',
    ]

if (locationSelect) {
    buildings.forEach(bldg => {
        locationSelect.innerHTML += "<option value='" + bldg + "'>" + "<span>" + bldg + "</span></option>"
    })
    locationSelect.value = localStorage.getItem('location')
}



//task labels for each post
const taskLabels = document.querySelectorAll('.taskLabel')

function animateForm() {
    formContainer.classList.add('animate')
    formContainer.style.visibility = 'visible'
}

function rememberSelection(filter) {
    localStorage.setItem(filter.name, filter.value)
}

//feed selects
const timespanSelect = document.querySelector("#timespanSelect")
const techSelect = document.querySelector("#techSelect")

//load values of selections if they're in this view
if (timespanSelect) {
timespanSelect.value = localStorage.getItem('timespan')
}
if (techSelect) {
techSelect.value = localStorage.getItem('tech')
}

const optionsList = 
['imaging',
'validation',
'deploy',
'incident',
'tc',
'breakfix']

//handle visibility of task input elements based on category selected
function makeVisible(selected) {
    console.log(selected)
    
    const selectedElement = document.querySelector(`.${selected}Options`)
    const selectedForm = document.querySelector(`#${selected}Options`)
    const selectedBtn = document.querySelector(`#${selected}Btn`)

    optionsList.forEach(opt => {
        const optElement = document.querySelector(`.${opt}Options`)
        const optForm = document.querySelector(`#${opt}Options`)
        const optBtn = document.querySelector(`#${opt}Btn`)
        try{
            optElement.classList.remove('d-flex')
            optElement.disabled = true
            optForm.disabled = true
            optElement.style.display = 'none'
            optBtn.checked = false
            selectedElement.classList.add('d-flex')
            selectedElement.disabled = false
            selectedForm.disabled = false
            selectedBtn.checked = true
        }
        catch (err) {
            console.log("doesn't exist yet?  " + err)
        }
    })

}

//task category button handling
function clearTask(filter) {
    localStorage.setItem('taskType', '')
}

if (!localStorage.getItem('taskType')) {
    optionsList.forEach(opt => {
        const optElement = document.querySelector(`.${opt}Options`)
        const optForm = document.querySelector(`#${opt}Options`)
        const optBtn = document.querySelector(`#${opt}Btn`)
        try {
        optElement.classList.remove('d-flex')
            optElement.disabled = true
            optForm.disabled = true
            optElement.style.display = 'none'
            optBtn.checked = false
        }
        catch(err) {
            console.log('view')
        }
    })
}

taskButtons.forEach(btn => {

    if (btn.value.toLowerCase() == window.localStorage.getItem('taskType')) {
        console.log(btn)
        btn.click()
        makeVisible(window.localStorage.getItem('taskType').toLowerCase())
    }

    btn.addEventListener('click', (e) => {
        const taskType = e.target.value.toLowerCase()

        if (ticketField) {
            if (e.target.value == 'Incident') {
                ticketField.value = "INC"
            }
            else {
                ticketField.value = "RITM"
            }
        }

        window.localStorage.setItem('taskType', taskType)

        makeVisible(taskType)

        if (viewContainer) {
             console.log('Button clicked in view!')
             taskLabels.forEach(post => {
                console.log(taskType, post.innerText.toLowerCase())
                if (post.innerHTML.toLowerCase().trim() != taskType) {
                    post.parentNode.parentNode.style.display = 'none'
                }
                else {
                    post.parentNode.parentNode.style.display = ''
                }
             })
        }
        // formContainer.style.backgroundColor = newBgColor()
    })
})
