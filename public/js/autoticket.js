const ticketField = document.querySelector("#title")
const formContainer = document.querySelector(".formContainer")

const taskButtons = document.querySelectorAll(".btn-check")

const addATask = document.querySelector('#addATask').addEventListener('click', animateForm)

function animateForm() {
    formContainer.classList.add('animate')
    formContainer.style.visibility = 'visible'
}

taskButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (e.target.value == 'Incident') {
            ticketField.value = "INC"
        }
        else {
            ticketField.value = "RITM"
        }
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
        formContainer.style.backgroundColor = newBgColor()
    })
})
