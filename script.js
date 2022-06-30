var isCat = false
var audioEnabled = false
var synth = new SpeechSynthesisUtterance()
var figure = document.querySelector('figure')
var currentDialog = 0

const dialog = [
	{
		text: 'Como assim você ainda não se inscreveu no Quiz de gestão por métricas ?',
		balloon: 'right'
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
		text: 'Aaahhh! não esqueça de chamar todo o seu time, ganhe pontos e mostre que você é fera!',
		image: '2',
		delay: 1000
	}
]

function refreshPosition(x, y) {
	let centerWidth = document.documentElement.clientWidth / 2
	let marginBottom = (document.documentElement.clientHeight - (figure.offsetTop + figure.clientHeight)) / 2
	let centerHeight = figure.offsetTop + (figure.clientHeight / 2) + marginBottom
	if (x < 0) x = centerWidth
	if (y < 0) y = centerHeight
	let posX = (x - centerWidth) / centerWidth
	let posY = (y - centerHeight) / centerHeight * -1
	document.documentElement.style.setProperty('--x-angle', `${posY * 45}deg`)
	document.documentElement.style.setProperty('--y-angle', `${posX * 45}deg`)
	document.documentElement.style.setProperty('--z-angle', `${document.documentElement.clientWidth/20}px`)
}
function resize() {
	let size = document.documentElement.clientHeight / 2
	if (size > document.documentElement.clientWidth) size = document.documentElement.clientWidth - 48
	document.documentElement.style.setProperty('--size', `${size}px`)
}
function setupVoice(text) {
	speechSynthesis.cancel()
	let actors = ['Daniel']
	let voice = speechSynthesis.getVoices().find(el => {
		let byName = new RegExp(`(${actors.join('|')})`, 'i').test(el.name.toLocaleLowerCase())
		let byLocal = el?.localService && el?.lang?.replace('_', '-').toLocaleLowerCase() == 'pt-br'
		return byName || byLocal
	})
	if (!voice) return setTimeout(() => setupVoice(text), 100)
	synth.lang = voice?.lang ?? 'pt-BR'
	synth.voice = voice
	synth.text = text
	synth.pitch = 0
	synth.rate = 1.5
	speechSynthesis.speak(synth)
}
figure.onclick = e => {
	e.stopPropagation()
	talk()
}
synth.onend = () => {
	if (currentDialog >= dialog.length-1) return figure.removeAttribute('data-text')
	currentDialog++
	talk()
}
function talk() {
	if (!dialog[currentDialog].text) return
	if (dialog[currentDialog].image) {
		figure.querySelector('img').src = `img/${dialog[currentDialog].image}.webp`
		figure.querySelector('img').onload = () => {
			setupText()
		}
	} else {
		setupText()
	}
}
function setupText() {
	if (dialog[currentDialog].balloon == 'right') {
		figure.classList.add('balloon-right')
	} else {
		figure.classList.remove('balloon-right')
	}
	if (dialog[currentDialog].delay) {
		figure.removeAttribute('data-text')
		setTimeout(() => {
			figure.setAttribute('data-text', dialog[currentDialog].text)
			setupVoice(dialog[currentDialog].text)
		}, dialog[currentDialog].delay)
	} else {
		figure.setAttribute('data-text', dialog[currentDialog].text)
		setupVoice(dialog[currentDialog].text)
	}
}
synth.onerror = () => {
	speechSynthesis.cancel()
}
window.onpagehide = () => {
	speechSynthesis.cancel()
}
window.onresize = () => {
	resize()
}
window.onclick = () => {
	speechSynthesis.cancel()
}
window.onmousemove = e => {
	refreshPosition(e.pageX, e.pageY)
}
document.onmouseenter = () => {
	figure.classList.remove('center')
}
document.onmouseleave = () => {
	figure.classList.add('center')
	refreshPosition(-1, -1)
}
document.ontouchstart = () => {
	figure.classList.remove('center')
}
document.ontouchend = () => {
	figure.classList.add('center')
	refreshPosition(-1, -1)
}
document.ontouchmove = e => {
	refreshPosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY)
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