var isCat = false
var audioEnabled = false
var synth = new SpeechSynthesisUtterance()
var figure = document.querySelector('figure')
var caption = document.querySelector('figcaption')
var currentDialog = 0
var voice

const dialog = [
	{
		text: 'Hey [S G I T I](SGITI), estão bem ?',
	},
	{
		text: 'Espero que sim, pois vim aqui especialmente\nconvocá-los para um desafio exclusivo!',
		image: '6'
	},
	{
		text: 'Na próxima Plenária vamos divulgar o pódio da [S G I T I](SGITI)\ncom os melhores colocados da rodada atual!',
		image: '4'
	},
	{
		text: 'Se você já jogou no período de homologação, teve uma colher de chá.\nSeus dados foram zerados para você poder jogar novamente.',
		image: '5',
		balloon: 'center'
	},
	{
		text: 'E você que ainda nem entrou. Por que ?\nCorre que dá tempo de tirar o atraso!',
		image: '1'
	},
	{
		text: 'As primeiras pessoas que concluírem o Quiz com maior pontuação ficarão na frente.\nO ranking está súper acirrado, então corre!',
		image: '4',
	},
	{
		text: 'Vamos de turma!',
		image: '2',
	}
]

function resize() {
	let size = document.documentElement.clientHeight / 2
	if (size > document.documentElement.clientWidth) size = document.documentElement.clientWidth - 48
	document.documentElement.style.setProperty('--size', `${size}px`)
}
function talk() {
	if (speechSynthesis.speaking) return
	if (!dialog[currentDialog].text) return
	caption.innerHTML = null
	if (dialog[currentDialog].delay) {
		setTimeout(() => {
			setupImage()
		}, dialog[currentDialog].delay)
	} else {
		setupImage()
	}
}
function setupImage() {
	if (dialog[currentDialog].image) {
		figure.querySelector('img').src = `img/${dialog[currentDialog].image}.webp`
		figure.querySelector('img').onload = () => setupText()
	} else {
		setupText()
	}
}
function setupText() {
	if (dialog[currentDialog].balloon == 'right') {
		caption.classList.remove('center')
		caption.classList.remove('left')
		caption.classList.add('right')
	} else if (dialog[currentDialog].balloon == 'center') {
		caption.classList.add('center')
		caption.classList.remove('left')
		caption.classList.remove('right')
	} else {
		caption.classList.remove('center')
		caption.classList.remove('right')
		caption.classList.add('left')
	}
	caption.innerHTML = dialog[currentDialog].text.replace(/\(|\)|\[.*\]/g, '')
	setupVoice(dialog[currentDialog].text)
}
function setupVoice(text) {
	speechSynthesis.cancel()
	if (!voice) {
		let actors = ['Daniel']
		voice = speechSynthesis.getVoices().find(el => {
			let byName = new RegExp(`(${actors.join('|')})`, 'i').test(el.name.toLocaleLowerCase())
			let byLocal = el?.localService && el?.lang?.replace('_', '-').toLocaleLowerCase() == 'pt-br'
			return byName || byLocal
		})
		if (!voice) return setTimeout(() => setupVoice(text), 100)
		synth.voice = voice
	}
	synth.lang = voice?.lang ?? 'pt-BR'
	synth.text = text.replace(/\[|\]|\(.*\)/g, '').replace(/\n/g, ' ')
	synth.pitch = 2
	synth.rate = 1.5
	speechSynthesis.speak(synth)
}
synth.onend = () => {
	if (currentDialog >= dialog.length-1) return figure.removeAttribute('data-text')
	currentDialog++
	talk()
}
window.onresize = () => {
	resize()
}
/* document.onclick = () => {
	if (audioEnabled) return
	synth.text = ''
	synth.volume = 0
	speechSynthesis.speak(synth)
	audioEnabled = true
	synth.volume = 1
} */
document.onreadystatechange = () => {
	if (document.readyState != 'complete') return
	figure.classList.add('show')
	resize()
}
document.onvisibilitychange = () => {
	if (document.hidden) speechSynthesis.pause()
	else speechSynthesis.resume()
}
figure.onclick = () => talk()