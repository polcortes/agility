/* eslint-disable react/prop-types */
import UserProfilePhoto from "../../UserProfilePhoto"

const ChatBubble = ({ message, sender, timeWasSent }) => {
  const timeWasSentString = timeWasSent.toLocaleString('es-ES').split(' ')[1]
  console.log("TIME", timeWasSent.toLocaleString('es-ES').split(' ')[1])

  return (
    <div className="flex items-start gap-2.5">
    {/* <div className="flex items-start gap-2.5"> */}
      {/* <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="Jese image" /> */}
      <UserProfilePhoto username={ sender } />
      <div className="flex flex-col gap-1 w-full max-w-[320px]">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-md font-subtitle font-semibold dark:text-gray-100 text-gray-900">{ sender }</span>
            <time dateTime={ timeWasSent.toLocaleString("es-ES") } className="text-sm font-normal text-gray-500">
              { timeWasSentString }
            </time>
          </div>
          <div className="flex flex-col leading-1.5 p-4 border-gray-200 dark:bg-dark-tertiary-bg bg-light-tertiary-bg rounded-e-xl rounded-es-xl">
            <p className="text-sm font-normal dark:text-gray-100 text-gray-900"> { message } </p>
          </div>
      </div>
    </div>
  )
}

export default ChatBubble