const form = document.querySelector('#form')
const classification = document.querySelector('#classification')
const totalRecords = document.querySelector('#total-records')
const best = document.querySelector('#best')
const reset = document.querySelector('#reset')
const modal = document.querySelector('#modal')
const cancelBtn = document.querySelector('#modal #close')
const deleteBtn = document.querySelector('#modal #delete')

let records = []
const medals = ["🥇", "🥈", "🥉"]

window.addEventListener('load', () => {
	records = localStorage.records ? JSON.parse(localStorage.records) : []
	renderRecords()
})

form.addEventListener('submit', e => {
	e.preventDefault()

	current = {
		name: e.target['name'].value,
		time: e.target['time'].value,
	}

	insertRecord(current)

	form.reset()
})

reset.addEventListener('click', () => resetRecords())

cancelBtn.addEventListener('click', () => modal.classList.remove('active'))
deleteBtn.addEventListener('click', e => {
	deleteRecord(e.target.getAttribute('data-js-index'))
	modal.classList.remove('active')
})

// FUNCTIONS

function renderRecords() {
	classification.innerHTML = ''

	records.forEach((record, index) => {
		classification.innerHTML += `
        <div class="card" data-js-index=${index}>
            <h3 class="position">${addZero(index + 1)}. <span class="name">${
			record.name
		} ${index < 3 ? medals[index] : null}</span></h3>
            <span class="time"><img src="./icons/time.svg" />${formatTime(
							record.time
						)}</span>
        </div>
        `
	})

	handleCards()
	updateAnalytics()
}

function handleCards() {
	const cards = document.querySelectorAll('.card')

	cards.forEach(card => {
		card.addEventListener('click', () => {
			const index = parseInt(card.getAttribute('data-js-index'))
			const modalText = document.querySelector('#modal p')
			const modalStats = document.querySelector('#modal #stats')

			modalText.innerHTML = `Tem certeza que deseja apagar o tempo de ${records[index].name}?`
			modalStats.innerHTML = `${index + 1}º lugar &mdash; ${formatTime(
				records[index].time
			)}`
			deleteBtn.setAttribute('data-js-index', index)
			modal.classList.add('active')
		})
	})
}

function updateAnalytics() {
	totalRecords.innerHTML = records.length
	records[0]
		? (best.innerHTML = `${records[0].name} : ${formatTime(records[0].time)}`)
		: (best.innerHTML = 'N/A')
}

function sortRecords() {
	records.sort((a, b) => a.time - b.time)
}

function insertRecord(record) {
	records.push(record)
	sortRecords()
	updateRecords()
	renderRecords()
}

function deleteRecord(index) {
	records.splice(index, 1)
	updateRecords()
	renderRecords()
}

function updateRecords() {
	localStorage.records = JSON.stringify(records)
}

function resetRecords(){
	records = []
	localStorage.removeItem('records')
	renderRecords()
}

function formatTime(time) {
	seconds = (time % 60).toFixed(1)
	minutes = Math.floor(time / 60)
	return `${minutes}m ${addZero(seconds)}s`
}

function addZero(number) {
	return number < 10 ? `0${number}` : number
}
