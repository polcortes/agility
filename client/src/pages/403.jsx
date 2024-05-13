import { useTranslation } from "react-i18next"

import { Helmet } from "react-helmet-async"

import { Link } from "react-router-dom"

import { useState, useEffect } from "react"

import ThemeToggler from "../components/ThemeToggler"
import LanguageChanger from "../components/LanguageChanger"

const Error403 = () => {
  const { t } = useTranslation()
  const [ theme, toggleTheme ] = useState('dark')

  useEffect(() => {
    // TODO: Implementar el observer para el cambio de tema
    const themeObserver = new MutationObserver((event) => {
      event.forEach((mutation) => {
        if (mutation.target.classList.contains('dark')) toggleTheme('dark')
        else toggleTheme('light')
      })
    })

    themeObserver.observe(document.documentElement, {
      attributes: true, 
      attributeFilter: ['class'],
      childList: false, 
      characterData: false,
    })
  }, [theme])

  return (
    <>
      <Helmet>
        <title>Permís denegat | Agility</title>
      </Helmet>
      <main className="w-screen h-screen flex items-center justify-center flex-col bg-light-primary-bg dark:bg-dark-secondary-bg">
        <div className="absolute top-6 right-6 flex gap-4">
            <ThemeToggler theme={ theme } setTheme={ toggleTheme } className={theme === 'dark' ? "from-transparent to-white" : "from-the-accent-color"} onClick={() => toggleTheme(theme)}/>
            <LanguageChanger></LanguageChanger>
        </div>
        <h1 className="text-the-accent-color text-9xl font-semibold mb-10">403</h1>
        <p className="text-xl dark:text-white">Sembla que no tens permís per a accedir a aquesta pàgina</p>
        {
            localStorage.getItem('userToken') === null
            ? <Link to="/login/" className="text-xl text-the-accent-color underline">Tornar a l'inici</Link>
            : <Link to="/dashboard/" className="text-xl text-the-accent-color underline">Tornar al llistat de projectes</Link>
        }
      </main>
    </>
  )
}

export default Error403