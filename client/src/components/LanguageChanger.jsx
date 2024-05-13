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
    const currentLanguage = i18n.language
    selectRef.current.value = currentLanguage
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