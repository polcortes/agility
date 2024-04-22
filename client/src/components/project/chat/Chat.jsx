import ChatBubble from "./ChatBubble"
import { useRef } from "react"

const Chat = () => {
  const aDate = new Date()
  const sectionInputRef = useRef(null)

  const handleSectionInputClick = () => {
    sectionInputRef.current.querySelector('#chat-input').focus()
  }

  return (
    <>
      <section className="flex flex-col justify-end w-full">
        <ChatBubble message="Hola, ¿cómo estás?" sender="Jese" timeWasSent={ aDate }/>
      </section>
      <section ref={ sectionInputRef } onClick={ handleSectionInputClick } className="hover:cursor-text flex items-center relative w-full pl-6 pr-14 h-auto min-h-[54px] max-h-24 bg-light-tertiary-bg rounded-[30px]">
        {/* <textarea rows={ 2 } id="chat-input" type="text" className="w-full h-fit max-h-32 resize-none bg-transparent outline-none">

        </textarea> */}

        { /* 
          TODO: Se rompe por todos lados. https://codepen.io/chriscoyier/pen/XWbqpzP   https://css-tricks.com/auto-growing-inputs-textareas/ */}
        <span contentEditable role="textbox" id="chat-input" type="text" className="block overflow-hidden empty:before:text-gray-500 empty:before:content-['placeholder...'] max-w-full w-full h-fit max-h-32 resize-none bg-transparent outline-none">

        </span>

        <button className="grid place-content-center rounded-full h-inherit size-[54px] absolute bottom-0 right-0 bg-the-accent-color">
          <svg width="30" height="28" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.04726 1.05022L26.5003 12.9992L2.04726 24.9482C1.90768 25.0019 1.75531 25.0128 1.60949 24.9797C1.46367 24.9466 1.33098 24.8709 1.22826 24.7622C1.12253 24.6507 1.04975 24.512 1.01798 24.3616C0.986209 24.2113 0.99669 24.055 1.04826 23.9102L4.75026 12.9992L1.04826 2.08822C0.99669 1.94343 0.986209 1.78719 1.01798 1.63681C1.04975 1.48643 1.12253 1.34778 1.22826 1.23622C1.33098 1.12755 1.46367 1.05185 1.60949 1.01874C1.75531 0.985619 1.90768 0.996579 2.04726 1.05022Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.75049 12.9992H26.5005" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </section>
    </>
  )
}

export default Chat