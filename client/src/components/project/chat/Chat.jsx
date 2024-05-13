/* eslint-disable react/prop-types */
import ChatBubble from "./ChatBubble"
import { useState, useRef, useEffect } from "react"

const Chat = ({ projectID, ws, chat, mainProjectContainerRef, thisUser, otherUsers }) => {
  const sectionInputRef = useRef(null)
  const [sortedChats, setSortedChats] = useState([])

  const sendMessage = () => {
    if (sectionInputRef.current.querySelector('#chat-input').innerText === '') return

    ws.send(JSON.stringify({
      type: 'sendMessage',
      projectID: projectID,
      token: window.localStorage.getItem('userToken'),
      message: sectionInputRef.current.querySelector('#chat-input').innerText
    }))

    sectionInputRef.current.querySelector('#chat-input').innerText = ''

    // mainProjectContainerRef.current.scrollTo(0, mainProjectContainerRef.current.scrollHeight)
  }

  useEffect(() => {
    if (chat && chat.length > 0) {
      setSortedChats(chat.sort((a, b) => {
        return new Date(a.timeWasSent) - new Date(b.timeWasSent)
      }))
    }

    console.log(sortedChats)

    // if (sortedChats.length > 0 && sortedChats.at(-1).token === window.localStorage.getItem('userToken')) mainProjectContainerRef.current.scrollTo(0, mainProjectContainerRef.current.scrollHeight)
  }, [chat])

  useEffect(() => {
    if (sortedChats.length > 0 && sortedChats.at(-1).token === window.localStorage.getItem('userToken')) mainProjectContainerRef.current.scrollTo(0, mainProjectContainerRef.current.scrollHeight)
  }, [sortedChats])

  const handleSectionInputClick = () => {
    sectionInputRef.current.querySelector('#chat-input').focus()
  }

  useEffect(() => {
    sectionInputRef.current.querySelector('#chat-input').addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault()
        sendMessage()
      }
    })
  }, [sectionInputRef.current])



  return (
    <>
      <section className="flex flex-col justify-end w-full">
        {
          sortedChats && sortedChats.length > 0
            ? sortedChats.map((message, index) => {
              console.log('message', message)
              return (
                <ChatBubble key={ index } message={ message.message } sender={ message.email } timeWasSent={ new Date(message.date) } thisUser={ thisUser } otherUsers={ otherUsers } />
              )
            })
            : (
              <p className="text-center text-gray-500">No hi ha cap missatge</p>
            )
        }
      </section>
      <section ref={ sectionInputRef } onClick={ handleSectionInputClick } className="sender-section hover:cursor-text flex items-center fixed bottom-8 w-full pl-6 h-auto min-h-[54px] max-h-24 dark:bg-dark-tertiary-bg bg-light-tertiary-bg rounded-[30px]">
        <span contentEditable role="textbox" id="chat-input" type="text" className="block overflow-y-scroll overflow-hidden dark:empty:before:text-gray-300 dark:text-white empty:before:text-gray-500 empty:before:content-['Escriu_un_missatge...'] max-w-full w-full h-fit max-h-32 resize-none bg-transparent outline-none"></span>
      </section>

      <button 
        className="fixed bottom-7 right-7 grid place-content-center rounded-full h-inherit min-h-[54px] min-w-[54px] size-[54px] bg-the-accent-color"
        onClick={ () => sendMessage() }
      >
        <svg width="30" height="28" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg"> 
          <path d="M2.04726 1.05022L26.5003 12.9992L2.04726 24.9482C1.90768 25.0019 1.75531 25.0128 1.60949 24.9797C1.46367 24.9466 1.33098 24.8709 1.22826 24.7622C1.12253 24.6507 1.04975 24.512 1.01798 24.3616C0.986209 24.2113 0.99669 24.055 1.04826 23.9102L4.75026 12.9992L1.04826 2.08822C0.99669 1.94343 0.986209 1.78719 1.01798 1.63681C1.04975 1.48643 1.12253 1.34778 1.22826 1.23622C1.33098 1.12755 1.46367 1.05185 1.60949 1.01874C1.75531 0.985619 1.90768 0.996579 2.04726 1.05022Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.75049 12.9992H26.5005" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </>
  )
}

export default Chat