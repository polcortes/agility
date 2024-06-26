/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { toast } from 'sonner'

const ShareProjectModal = ({ project, setIsShareProjectModalOpen, isShareProjectModalOpen, webSocket }) => {
  const dialogRef = useRef()
  const emailRef = useRef(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (isShareProjectModalOpen) {
      dialogRef.current.showModal()
      dialogRef.current.style.opacity = 1
      document.documentElement.style.setProperty('--backdrop-bg', "rgba(0, 0, 0, .8)!important")
    } else {
      document.documentElement.style.setProperty('--backdrop-bg', "transparent")
      dialogRef.current.style.opacity = 0
      setTimeout(() => dialogRef.current.close(), 200)
    }
  }, [isShareProjectModalOpen])

  // TODO: En TODOS los "dialog" prevent default de pulsar la tecla de escape mientras estén activos.

  const manageEsc = (ev) => {
    if (ev.key === 'Escape') {
      ev.preventDefault()
      setIsShareProjectModalOpen(false)
    }
  }

  const sendInvite = () => {
    if (project.invitedUsers && project.invitedUsers.includes(emailRef.current.value)) {
      toast.error(t('project.shareNotificationKoRepeated'), {
        duration: 3000,
        position: 'bottom-right',
        closeButton: true,
      })
      return
    } else {
      webSocket.send(JSON.stringify({
        type: 'inviteUser',
        projectID: project._id,
        email: emailRef.current.value
      }))
      const email = emailRef.current.value
      console.log(email)
      console.log(project)
      axios.post(`${import.meta.env.VITE_API_ROUTE}/sendInviteEmail`, {
        projectID: project._id,
        email: email,
        token: localStorage.getItem('userToken')
      })
      .then(res => {
        toast.success(t('project.shareNotificationOk'), {
          duration: 3000,
          position: 'bottom-right',
          closeButton: true,
        })
      })
      .catch(err => {
        toast.error(t('project.shareNotificationKo'), {
          duration: 3000,
          position: 'bottom-right',
          closeButton: true,
        })
      })
    }
    emailRef.current.value = ""
  }

  // Llamada al back para compartir.

  return (
    <dialog onKeyDown={ manageEsc } className="shadow-xl text-black dark:text-white relative min-w-96 w-1/3 z-50 px-5 flex flex-col p-3 rounded-xl bg-light-secondary-bg dark:bg-dark-secondary-bg" ref={ dialogRef }>
      <button title='[Esc] Tancar' className='absolute text-black dark:text-white top-3 right-3 dark:hover:text-red-500 hover:text-red-500 transition-all' onClick={() => setIsShareProjectModalOpen(false)}>
        <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
      </button>

      <h2 className='font-title font-bold text-3xl mb-5'>{ t('project.shareTitle') }</h2>
      <div className='w-full inline-flex gap-2'>
        <input className='w-full px-3 border-2 border-black rounded-md font-body bg-transparent text-black dark:text-white dark:border-white outline-none font-medium' ref={emailRef} type="email" name="share-project-email" id="share-project-email" placeholder={ t('project.sharePlaceholder') } />
        <button 
            onKeyDown={(ev) => {
              if (ev.key === 'Enter') sendInvite()
            }}
            onClick={() => sendInvite()}
            className='bg-the-accent-color flex items-center justify-center rounded-md px-3 py-2 text-white font-medium hover:scale-105 transition-all gap-2 font-body'
        >
            {t('project.shareBtn')}
        </button>
      </div>

      <div>
        <ul className='block'>
          <li className={`flex items-center h-fit w-full border-black py-3 ${project.invitedUsers && project.invitedUsers.length > 0 && "border-b-2"}`}>
              <span className='mr-5 aspect-square size-12 flex items-center justify-center bg-slate-400 rounded-full text-xl text-black'>
                  {project.creator[0].toUpperCase()}
              </span>

              <span className='flex flex-col w-full font-body font-medium'>
                  <h3>{project.creator}</h3>
              </span>

              <span className="font-body font-medium">{ t('project.shareCreator') }</span>
          </li>
          {project.invitedUsers && project.invitedUsers.map((user, index) => {
            return (
              <li key={index} className='flex items-center h-fit w-full border-black py-3'>
                <span className='mr-5 aspect-square size-12 flex items-center justify-center bg-slate-400 rounded-full text-xl'>
                  {user[0].toUpperCase()}
                </span>

                <span className='flex flex-col w-full'>
                  <h3 className='max-w-[170px] overflow-hidden text-ellipsis'>{user}</h3>
                </span>

                <span>{ t('project.shareInvited') }</span>
              </li>
            )
          })}
        </ul>
      </div>
    </dialog>
  )
}

export default ShareProjectModal