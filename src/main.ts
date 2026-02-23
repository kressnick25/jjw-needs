import './style.css'

// Setup click items
const imageDivs = document.querySelectorAll<HTMLFormElement>('.container > div')
const notificationUrl = import.meta.env.VITE_NOTIFY_URL

function clickHandler(e: PointerEvent) {
    e.stopPropagation()
    const current = e.target! as HTMLElement
    const currentDiv: HTMLDivElement = current.closest('.container > div')!
    const label = currentDiv.children[0] as HTMLLabelElement


    fetch(notificationUrl, {
        method: 'POST',
        body: label.innerText,
        headers: {
            'X-Tags': 'rotating_light',
        }
    })
}

for (const child of imageDivs) {
    if (child.tagName.toLowerCase() !== 'div') continue
    child.addEventListener('click', clickHandler)
}

// Extra items handling
type Extra = {
    name: string
    dataName: string
}
const form = document.querySelector<HTMLFormElement>('#add-item')!
const extrasDiv = document.querySelector<HTMLDivElement>('#extras')!
form.addEventListener('submit', e => {
    e.preventDefault()
    const data = new FormData(form)
    const name = data.get('name')!.toString()
    const dataName = name.toLowerCase().replaceAll(' ', '-')
    const extra: Extra = { name, dataName }
    
    extrasDiv.append(createExtraDiv(extra))

    saveExtra(extra)
})

// load persisted extras
const extras = getExtras()
for (const e of extras) {
    const newElem = createExtraDiv(e)
    extrasDiv?.append(newElem)
}


function createExtraDiv(e: Extra) {
    const div = document.createElement('div')
    const label = document.createElement('label')
    label.setAttribute('for', `img-${e.dataName}`)
    label.innerText = e.name
    const img = document.createElement('img')
    img.id = `img-${e.dataName}`
    img.setAttribute('src', '/img/generic.png')
    const button = document.createElement('button')
    button.innerText = 'Remove'
    button.addEventListener('click', function () {
        deleteExtra(e)
        div.remove() 
    })
    div.append(label, img, button)
    return div
}

// set subscribe URL
const linkElem = document.querySelector<HTMLElement>('#subscribe')
linkElem?.setAttribute('href', notificationUrl)

function saveExtra(e: Extra) {
    const extras = getExtras()
    extras.push(e)
    localStorage.setItem('extras', JSON.stringify(extras))
}

function deleteExtra(e: Extra) {
    let extras = getExtras()
    extras = extras.filter(i => i.name != e.name)
    localStorage.setItem('extras', JSON.stringify(extras))
}

function getExtras(): Array<Extra> {
    const extraString = localStorage.getItem('extras')
    let extras: Array<Extra>
    if (extraString) {
        extras = JSON.parse(extraString) as Array<Extra>
    } else {
        extras = []
    }
    return extras
}

