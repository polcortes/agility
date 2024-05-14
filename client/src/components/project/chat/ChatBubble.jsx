/* eslint-disable react/prop-types */
import UserProfilePhoto from "../../UserProfilePhoto"
import { useState, useEffect } from "react"

const ChatBubble = ({ message, sender, timeWasSent, thisUser, otherUsers }) => {
  const [ isTheSenderThisUser, setIsTheSenderThisUser ] = useState(false)
  const [ senderObject, setSenderObject ] = useState('')
  console.log(otherUsers)
  console.log("SENDER", sender)
  /**
   * 
   * @param {dateTime} timeWasSent 
   */
  const getNiceFormattedDate = (timeWasSent) => {
    let finalDateString = ''
    if (timeWasSent.getDay() === new Date().getDay()
          && timeWasSent.getMonth() === new Date().getMonth()
          && timeWasSent.getFullYear() === new Date().getFullYear()
    ) {
      finalDateString += `Hoy a las ${timeWasSent.toLocaleTimeString()}`;
    } else if (timeWasSent.getDay() === (new Date().getDay() - 1)
                && timeWasSent.getMonth() === new Date().getMonth()
                && timeWasSent.getFullYear() === new Date().getFullYear()
    ) {
      finalDateString += `Ayer a las ${timeWasSent.toLocaleTimeString()}`;
    } else {
      finalDateString += `El ${timeWasSent.getDay()} de ${timeWasSent.toLocaleString('es-ES', { month: 'long' })} de ${timeWasSent.getFullYear()} a las ${timeWasSent.toLocaleTimeString()}`;
    }

    return finalDateString;
  }

  console.log(`Sender: ${sender}\nthisUser: ${thisUser}`)

  const checkIfSenderIsThisUser = () => {
    if (sender === thisUser.email) setIsTheSenderThisUser(true)
    else setIsTheSenderThisUser(false)
  }

  const getUserData = (email, otherUsers, thisUser) => {
    if (sender === thisUser.email) {
      setSenderObject(thisUser.email)}
    else {
      console.log("otherUsers", otherUsers)
      setSenderObject(otherUsers.find(user => user.email === email))
      console.log("newSenderObject", senderObject)
    }
  }

  useEffect(() => {
    checkIfSenderIsThisUser()
    getUserData(sender, otherUsers, thisUser)
    console.log("message", message);
  }, [])

  useEffect(() => {
    console.log('senderObject', senderObject)
  }, [senderObject])

  const timeWasSentString = getNiceFormattedDate(timeWasSent);
  
  return (
    <div className="flex items-start gap-2.5">
    {/* <div className="flex items-start gap-2.5"> */}
      {/* <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="Jese image" /> */}
      {/* sender === username!! */}
      <UserProfilePhoto username={ sender } />
      <div className="flex flex-col gap-1 w-full max-w-[320px]">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-md font-subtitle font-semibold dark:text-gray-100 text-gray-900">{ sender }</span>
            <time dateTime={ timeWasSent.toLocaleString("es-ES") } className="text-sm font-normal text-gray-500">
              { timeWasSentString }
            </time>
          </div>
          <div className={`flex flex-col leading-1.5 p-4 border-gray-200  rounded-e-xl rounded-es-xl ${sender === thisUser.email ? "bg-the-accent-color" : "dark:bg-dark-tertiary-bg bg-light-tertiary-bg"}`}>
            <p className={`text-sm font-normal ${sender === thisUser.email ? "text-white" : "dark:text-gray-100 text-gray-900"}`}> { message } </p>
          </div>
      </div>
    </div>
  )
}

export default ChatBubble