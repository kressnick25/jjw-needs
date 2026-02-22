import './style.css'

const imageDivs = document.querySelectorAll<HTMLFormElement>('.container > div')!
const notificationUrl = import.meta.env.VITE_NOTIFY_URL

for (const child of imageDivs) {
    if (child.tagName.toLowerCase() !== 'div') continue
    child.addEventListener('click', e => {
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
    })
}

