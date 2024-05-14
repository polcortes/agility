/* eslint-disable react/prop-types */
import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import ThemeDetector from './ThemeDetector'
import ThemeToggler from './ThemeToggler'
import LanguageChanger from './LanguageChanger'

const UserMenuDialog = ({ setIsUserMenuOpen, isUserMenuOpen, theme, setTheme }) => {
  const dialogRef = useRef()
  const { t } = useTranslation()

  useEffect(() => {
    if (isUserMenuOpen) {
      dialogRef.current.showModal()
      dialogRef.current.style.opacity = 1
      document.documentElement.style.setProperty('--backdrop-bg', "rgba(0, 0, 0, .8)!important")
    } else {
      document.documentElement.style.setProperty('--backdrop-bg', "transparent")
      dialogRef.current.style.opacity = 0
      setTimeout(() => dialogRef.current.close(), 200)
    }
  }, [isUserMenuOpen])

  const manageEsc = (ev) => {
    if (ev.key === 'Escape') {
      ev.preventDefault()
      setIsUserMenuOpen(false)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('userToken')
    window.location.href = '/'
  }

  const handleOutsideClick = (ev) => {
    if (ev.target === dialogRef.current) {
      setIsUserMenuOpen(false)
    }
  }

  return (
    <dialog onClick={ handleOutsideClick } onKeyDown={ manageEsc } className="shadow-xl w-[300px] dark:bg-dark-secondary-bg relative z-50 rounded-xl overflow-hidden" ref={ dialogRef }>
      <ThemeDetector theme={ theme } setTheme={ setTheme } />
      <div className='relative w-full h-full p-10 flex flex-col items-center'>
        <button title='[Esc] Tancar' className='absolute dark:text-white text-black top-3 right-3 dark:hover:text-red-500 hover:text-red-500 transition-none' onClick={() => setIsUserMenuOpen(false)}>
          <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
        </button>

        <h2 className='font-title dark:text-white font-bold text-3xl mb-5'>{ t('userMenu.title') }</h2>
        <label className='font-lg dark:text-white -pb-2' htmlFor="">{ t('userMenu.theme') }</label>
        <ThemeToggler className='w-20' theme={ theme } setTheme={ setTheme } />

        <label className='font-lg dark:text-white pb-2'>{ t('userMenu.language') }</label>
        <LanguageChanger extraStyles={`mx-auto`} />

        <button
          onClick={() => logout()}
          className='border-2 border-red-500 mx-[20%] rounded-md w-fit px-4 py-2 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition-colors mt-5'
        >{ t('userMenu.logout') }</button>
      </div>
    </dialog>
  )
}

export default UserMenuDialog