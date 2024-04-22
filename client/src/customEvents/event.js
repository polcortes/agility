const subscribe = (eventName, listener) => document.addEventListener(eventName, listener)

const unsubscribe = (eventName, listener) => document.removeEventListener(eventName, listener)

const publish = (eventName, data) => {
    const event = new CustomEvent(eventName, {detail: data})
    document.dispatchEvent(event)
}

export { subscribe, unsubscribe, publish }