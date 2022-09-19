const ticketField = document.querySelector("#title")
const formContainer = document.querySelector(".formContainer")
const viewContainer = document.querySelector("#viewContainer")

//feed selects
const timespanSelect = document.querySelector("#timespanSelect")
const techSelect = document.querySelector("#techSelect")

const taskButtons = document.querySelectorAll(".btn-check")

function animateForm() {
    formContainer.classList.add('animate')
    formContainer.style.visibility = 'visible'
}


//handle visibility of task input elements based on category selected
function makeVisible(selected) {
    console.log(selected)
    
    const selectedElement = document.querySelector(`.${selected}Options`)
    const selectedForm = document.querySelector(`#${selected}Options`)
    const selectedBtn = document.querySelector(`#${selected}Btn`)

    const optionsList = ['imaging',
    'validation',
    'deploy',
    'incident',
    'tc',
    'breakfix']

    optionsList.forEach(opt => {
        console.log(`${opt}Options`)
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
        catch {
            console.log("doesn't exist yet")
        }
    })


}

//task category button handling

taskButtons.forEach(btn => {
    if (btn.value.toLowerCase() == window.localStorage.getItem('taskType')) {
        console.log(btn)
        btn.click()
        makeVisible(window.localStorage.getItem('taskType').toLowerCase())
    }
    if (viewContainer) {
        var url = window.location.pathname
        var getQuery = url.split('/')[2]
        if (!getQuery) {
            btn.checked = false
        }
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
            window.location.replace(`/feed/${taskType}`)
        }
        // formContainer.style.backgroundColor = newBgColor()
    })
})
