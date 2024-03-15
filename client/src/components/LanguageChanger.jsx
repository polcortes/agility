import { useTranslation } from 'react-i18next'

const langs = {
  en: { nativeName: 'English' },
  es: { nativeName: 'Español' },
  ca: { nativeName: 'Catalan' }
}

const LanguageChanger = ( props ) => {
  const { i18n } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="absolute top-6 right-6 flex gap-4">
      {Object.keys(langs).map((lng) => (
        <button className='px-3 py-2 hover:bg-gray-400/50 dark:hover:bg-slate-200/10 rounded-full transition-colors' key={lng} onClick={() => changeLanguage(lng)}>
          {langs[lng].nativeName}
        </button>
      ))}
    </div>
  )
}

export default LanguageChanger