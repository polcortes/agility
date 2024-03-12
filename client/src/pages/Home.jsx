import DarkIcon from '../assets/icons/dark-agility'
import LightIcon from '../assets/icons/light-agility'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import LanguageChanger from '../components/LanguageChanger'

import { Helmet } from 'react-helmet-async'

import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
// import { useTheme } from '../custom-hooks/useTheme'

const Home = () => {
  const { t } = useTranslation()

  const [theme, setTheme] = useState('dark')
  const [ user, setUser ] = useState([]);

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

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  const googleLoginCallback = (userData) => {
    if (userData) {
      axios
        .post('http://localhost:3000/googleLogin', userData)
        .then((res) => {
          console.log(res.data);
        })
    }
  }

  useEffect(
    () => {
        if (user && user.access_token) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    googleLoginCallback(res.data)
                    console.log(res.data);
                })
                .catch((err) => console.log(err));
        }
    },
    [ user ]
  );


  return (
    <>
      <Helmet>
        <title>{t("home.seoTitle")}</title>
        <meta name="description" content={t("home.seoDescription")} />
      </Helmet>
      <main 
        className="
          min-h-screen w-screen xl:p-4 box-border font-body transition-[padding]
          bg-gradient-to-t from-light-primary-bg/80 to-light-primary-bg text-black dark:from-black dark:to-dark-primary-bg dark:text-white
          grid grid-cols-[1fr] grid-rows-[35%_65%] xl:grid-cols-[4fr_2fr] xl:grid-rows-[1fr] xl:gap-4
        "
      >
        {/* <!--  bg-white text-black dark:bg-[#100C12] dark:text-white  --> */}
        
        <section className="relative bg-light-secondary-bg dark:bg-dark-secondary-bg/80 px-6 py-14 flex flex-col items-center justify-center rounded-none xl:rounded-md">
          <LanguageChanger props={true} className={`flex absolute right-0 top-0 xl:hidden`} />

          { // Dark theme logo
            theme === 'dark' 
              && <DarkIcon className={`w-[50vw] h-auto`} />
          }

          { // Light theme logo
            theme === 'light' 
              && <LightIcon className={`w-[50vw] h-auto`} />
          }
          <div className="text-2xl mt-5 font-subtitle font-medium tracking-wide">
            { t("home.description1") }
          </div>
          <div className='text-2xl home-animated-decoration font-subtitle font-medium tracking-wide'>
            { t("home.description2") }
          </div>
        </section>
        <aside className="relative bg-light-secondary-bg dark:bg-dark-secondary-bg/80 px-6 py-14 flex flex-col items-center justify-center rounded-none xl:rounded-md">
          <button onClick={() => toggleTheme(theme)}> {theme === 'dark' ? THEME_ICONS.dark : THEME_ICONS.light} </button>
          <LanguageChanger props={true} className={`hidden xl:flex`} />
          
          <h1 className='text-3xl font-bold font-subtitle'>{ t("home.accessAccount") }</h1>
          <label htmlFor="email" className='text-lg mt-6'>{ t("home.loginUsername") }</label>
          <input type="email" id="email" className='w-full p-2 mt-2 border-2 border-black dark:border-white rounded-md bg-transparent' />
          <label htmlFor="password" className='text-lg mt-6'>{ t("home.loginPassword") }</label>
          <input type="password" id="password" className='w-full p-2 mt-2 border-2 border-black dark:border-white rounded-md bg-transparent' />
          <button onClick={login} className='bg-indigo-600 text-white dark:bg-white py-2 px-4 mt-6 dark:text-black font-semibold cursor-pointer rounded-full hover:bg-indigo-800 dark:hover:bg-slate-100/70 transition-colors'>
            Google
          </button>

        </aside>
      </main>
    </>
  );
}

export default Home;