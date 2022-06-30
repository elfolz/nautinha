var isCat = false
var audioEnabled = false
var synth = new SpeechSynthesisUtterance()
var figure = document.querySelector('figure')
var caption = document.querySelector('figcaption')
var currentDialog = 0
var voice

const dialog = [
	{
		text: 'Como assim você ainda não se inscreveu no Quiz de gestão por métricas ?',
		balloon: 'right',
		image: '1'
	},
	{
		text: 'Não sabe do que eu tô falando?! Te explico.',
		image: '3'
	},
	{
		text: 'É um quiz para testar seus conhecimentos em gestão por métricas e ajudar você a entender os principais conceitos desse assunto.',
		image: '4',
		balloon: 'right'
	},
	{
		text: 'E aí? Bora jogar?!',
		image: '0'
	},
	{
		text: 'Aaahhh! não esqueça de chamar todo o seu time. Ganhe pontos e mostre que você é fera!',
		image: '2',
		delay: 500
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
		caption.classList.add('balloon-right')
	} else {
		caption.classList.remove('balloon-right')
	}
	caption.innerHTML = dialog[currentDialog].text
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
	synth.text = text
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
document.onclick = () => {
	if (audioEnabled) return
	synth.text = ''
	synth.volume = 0
	speechSynthesis.speak(synth)
	audioEnabled = true
	synth.volume = 1
}
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