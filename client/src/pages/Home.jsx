import DarkIcon from '../assets/icons/dark-agility'
import LightIcon from '../assets/icons/light-agility'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import LanguageChanger from '../components/LanguageChanger'
// import { useTheme } from '../custom-hooks/useTheme'

const Home = () => {
  const { t } = useTranslation()

  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => setTheme(e.matches ? 'dark' : 'light'))

    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    document.documentElement.classList.add(
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    )

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', e => setTheme(e.matches ? 'dark' : 'light'))
    }
  }, [])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    document.documentElement.classList.toggle("dark");
  }

  const THEME_ICONS = {
    dark: "Cambiar a tema claro",
    light: "Cambiar a tema oscuro"
  }

  return (
    <main 
      className="
        min-h-screen w-screen p-4 box-border font-body
        bg-white dark:bg-[#100C12] text-black dark:text-white 
        grid grid-cols-[4fr_2fr] gap-4
      "
    >
      <section className="bg-[#F3F3F3] dark:bg-[#251B28]/80 px-6 py-14 rounded-md flex flex-col items-center justify-center">
        
        { // Dark theme logo
          theme === 'dark' 
            && <DarkIcon className="w-8 h-8" />
        }

        { // Light theme logo
          theme === 'light' 
            && <LightIcon className="w-8 h-8" />
        }
        <div className="text-2xl mt-5 font-subtitle font-medium tracking-wide">
          { t("home.description1") }
        </div>
        <div className='text-2xl home-animated-decoration font-subtitle font-medium tracking-wide'>
          { t("home.description2") }
        </div>
      </section>
      <aside className="relative bg-[#F3F3F3] dark:bg-[#251B28]/80 px-6 py-14 rounded-md flex flex-col items-center justify-center">
        <button onClick={() => toggleTheme(theme)}> {theme === 'dark' ? THEME_ICONS.dark : THEME_ICONS.light} </button>
        <LanguageChanger props={true} />
        
        <h1 className='text-3xl font-bold font-subtitle'>{ t("home.accessAccount") }</h1>
        <button className='bg-indigo-600 text-white dark:bg-white py-2 px-4 mt-6 dark:text-black font-semibold cursor-pointer rounded-full hover:bg-indigo-800 dark:hover:bg-slate-100/70 transition-colors'>
          Google
        </button>

      </aside>
    </main>
  );
}

export default Home;