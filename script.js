const form = document.querySelector('#form')
const classification = document.querySelector('#classification')
const totalRecords = document.querySelector('#total-records')
const best = document.querySelector('#best')
const reset = document.querySelector('#reset')

let records = []

window.addEventListener('load', () => {
	records = localStorage.records ? JSON.parse(localStorage.records) : []
	renderRecords()
	updateAnalytics()
})

form.addEventListener('submit', e => {
	e.preventDefault()

	current = {
		name: e.target['name'].value,
		time: e.target['time'].value,
	}

	updateRecords(current)
	renderRecords()

	form.reset()
})

reset.addEventListener('click', () => {
	records = []
	localStorage.removeItem('records')
	renderRecords()
	updateAnalytics()
})

function sortRecords() {
	records.sort((a, b) => a.time - b.time)
}

function renderRecords() {
	classification.innerHTML = ''

	records.forEach((record, index) => {
		classification.innerHTML += `
        <div class="card">
            <h3 class="position">${addZero(index + 1)}. <span class="name">${
			record.name
		}</span></h3>
            <span class="time"><img src="./icons/time.svg" />${formatTime(
							record.time
						)}</span>
        </div>
        `
	})
}

function updateRecords(record) {
	records.push(record)
	sortRecords()

	localStorage.records = JSON.stringify(records)
	updateAnalytics()
}

function formatTime(time) {
	seconds = (time % 60).toFixed(1)
	minutes = Math.floor(time / 60)
	return `${minutes}m ${addZero(seconds)}s`
}

function addZero(number) {
	return number < 10 ? `0${number}` : number
}

function updateAnalytics() {
	totalRecords.innerHTML = records.length
	best.innerHTML = `${records[0].name} : ${formatTime(records[0].time)}`
}
