import { useTranslation } from 'react-i18next'
import { useRef, useEffect } from 'react'

const langs = {
  en: { nativeName: 'English' },
  es: { nativeName: 'Español' },
  ca: { nativeName: 'Català'  }
}

const LanguageChanger = ( props ) => {
  const { i18n } = useTranslation()

  const selectRef = useRef(null)

  useEffect(() => {
    // if (navigator.language.includes('es')) i18n.changeLanguage('es')
    // if (selectRef.current.value === '') i18n.changeLanguage(navigator.language.slice(0, 2))
    // console.log('navigator preferred lang', navigator.language)
  }, [])

  useEffect(() => {
    let currentLanguage = i18n.language
    if (currentLanguage.search('-') === -1) selectRef.current.value = currentLanguage
    else selectRef.current.value = currentLanguage.slice(0, 2)
  })

  const changeLanguage = () => {
    const lng = selectRef.current.value
    i18n.changeLanguage(lng)
  }

  return (
    <select ref={ selectRef } className={`${window.location.pathname === '/' && 'absolute'} ${props.extraStyles} dark:bg-transparent dark:border-white dark:text-white top-6 right-6 flex py-2 px-4 border-2 border-black rounded-md gap-4`} onChange={() => changeLanguage()}>
      {Object.keys(langs).map((lng) => (
        <option value={ lng } className={`py-2 px-4 hover:bg-gray-400/50 dark:hover:bg-slate-200/10 rounded-full transition-colors`} key={lng}>
          {langs[lng].nativeName}
        </option>
      ))}
    </select>
  )
}

export default LanguageChanger