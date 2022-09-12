const ticketField = document.querySelector("#title")
const formContainer = document.querySelector(".formContainer")

const taskButtons = document.querySelectorAll(".btn-check")

const addATask = document.querySelector('#addATask').addEventListener('click', animateForm)

function animateForm() {
    formContainer.classList.add('animate')
    formContainer.style.visibility = 'visible'
}

function makeVisible(selected) {
    console.log(selected)
    const optionsList = ['imaging',
    'validation',
    'deploy',
    'incident',
    'tc',
    'breakfix']
    const selectedElement = document.querySelector(`.${selected}Options`)
    optionsList.forEach(opt => {
        console.log(`.${opt}Options`)
        const optElement = document.querySelector(`.${opt}Options`)
        try{
            optElement.classList.remove('d-flex')
            optElement.disabled = true
            optElement.style.display = 'none'
            selectedElement.classList.add('d-flex')
            selectedElement.disabled = false
        }
        catch {
            console.log("doesn't exist yet")
        }
    })


}
taskButtons.forEach(btn => {

    if (btn.value == window.localStorage.getItem('taskType')) {
        btn.click()
        makeVisible(window.localStorage.getItem('taskType').toLowerCase())
    }

    btn.addEventListener('click', (e) => {
        if (e.target.value == 'Incident') {
            ticketField.value = "INC"
        }
        else {
            ticketField.value = "RITM"
        }
        window.localStorage.setItem('taskType', e.target.value)
        let newBgColor = () => {
            switch (e.target.value) {
                case 'Incident':
                    formContainer.style.color = "white"
                    return "#dc3545"
                case 'Validation':
                    formContainer.style.color = "white"
                    return "#0d6efd"
                case 'Deploy':
                    formContainer.style.color = "white"
                    return "#198754"
                case 'Imaging':
                    imagingOptions.style.visibility = 'visible'
                    formContainer.style.color = "black"
                    return "#f8f9fa"
                case 'TC':
                    formContainer.style.color = "white"
                    return "#6c757d"
                case 'Breakfix':
                    formContainer.style.color = "black"
                    return "#ffc107"
            }
        }
        makeVisible(e.target.value.toLowerCase())
        // formContainer.style.backgroundColor = newBgColor()
    })
})
