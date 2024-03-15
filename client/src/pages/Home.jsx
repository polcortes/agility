import DarkIcon from '../assets/icons/dark-agility'
import LightIcon from '../assets/icons/light-agility'
import GoogleLogo from '../assets/icons/google-logo'
import { useTranslation } from 'react-i18next'
import { useState, useEffect, useRef } from 'react'
import LanguageChanger from '../components/LanguageChanger'

import { Helmet } from 'react-helmet-async'

import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import ThemeToggler from '../components/ThemeToggler'
// import { useTheme } from '../custom-hooks/useTheme'

const Home = () => {
  const { t } = useTranslation()

  const [theme, setTheme] = useState('dark')
  const [formType, setFormType] = useState('login')
  const [ user, setUser ] = useState([])
  const [ error, setError ] = useState({field: '', message: ''})
  const email = useRef(null)
  const username = useRef(null)
  const password = useRef(null)
  const repeatPassword = useRef(null)

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

  const toggleFormType = () => {
    setFormType((prevFormType) => (prevFormType === 'login' ? 'register' : 'login'));
  }

  const THEME_ICONS = {
    dark: "Cambiar a tema claro",
    light: "Cambiar a tema oscuro"
  }

  const login = () => {
    axios
      .post('http://localhost:3000/login', {
        email: email.current.value,
        password: password.current.value
      })
      .then((res) => {
        console.log(res.data)
        window.location.href = '/dashboard'
      })
  }

  const register = () => {
    axios
      .post('http://localhost:3000/register', {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value
      })
      .then((res) => {
        console.log(res.data)
        window.location.href = '/dashboard'
      })
  }

  

  const loginGoogle = useGoogleLogin({
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
          <ThemeToggler className={theme === 'dark' ? "from-transparent to-white" : "from-the-accent-color"} onClick={() => toggleTheme(theme)}/>
          <LanguageChanger className={`hidden xl:flex`} />
          {formType === 'login' && (
            <>
              <h1 className='text-3xl font-bold font-subtitle'>{ t("home.loginMessage") }</h1>
              <div className="form-group w-8/12 mt-6">
                <label htmlFor="email" className='text-lg'>{ t("home.loginUsername") }</label>
                <input ref={email} type="email" id="email" className='w-full p-2 border-2 border-black dark:border-white rounded-md bg-transparent' />
              </div>
              <div className="form-group w-8/12 mt-6">
                <label htmlFor="password" className='text-lg'>{ t("home.loginPassword") }</label>
                <input ref={password} type="password" id="password" className='w-full p-2 border-2 border-black dark:border-white rounded-md bg-transparent' />
              </div>
              <div className="w-8/12 flex justify-between">
                <span></span>
                <span onClick={toggleFormType} className="underline cursor-pointer text-sm text-the-accent-color">{t("home.registerLink")}</span>
              </div>
              <button onClick={login} className='bg-the-accent-color text-white dark:bg-white py-2 px-4 mt-6 dark:text-black font-semibold cursor-pointer rounded-full hover:bg-indigo-800 dark:hover:bg-slate-100/70 transition-colors'>
                {t("home.loginButton")}
              </button>
            </>
          )}
          {formType === 'register' && (
            <>
              <h1 className='text-3xl font-bold font-subtitle'>{ t("home.registerMessage") }</h1>
              <div className="form-group w-8/12 mt-6">
                <label htmlFor="username" className='text-lg'>{ t("home.registerUsername") }</label>
                <input ref={username} type="text" id="username" className='w-full p-2 border-2 border-black dark:border-white rounded-md bg-transparent' />
                <span className={`block w-full p-2 text-sm font-extrabold h-8 ${error.field === "username" ? "text-red-500" : "text-transparent"}`}> {(error.field === "username" ? error.message : "")}</span>
              </div>
              <div className="form-group w-8/12 mt-1">
                <label htmlFor="email" className='text-lg'>{ t("home.registerEmail") }</label>
                <input ref={email} type="email" id="email" className='w-full p-2 border-2 border-black dark:border-white rounded-md bg-transparent' />
                <span className={`block w-full p-2 text-sm font-extrabold h-8 ${error.field === "email" ? "text-red-500" : "text-transparent"}`}> {(error.field === "email" ? error.message : "")}</span>
              </div>
              <div className="form-group w-8/12 mt-1">
                <label htmlFor="password" className='text-lg'>{ t("home.registerPassword") }</label>
                <input ref={password} type="password" id="password" className='w-full p-2 border-2 border-black dark:border-white rounded-md bg-transparent' />
                <span className="block w-full p-2 text-sm font-extrabold invisible">AAAAAAAAAA</span>
              </div>
              <div className="form-group w-8/12 mt-1">
                <label htmlFor="repeat-password" className='text-lg'>{ t("home.registerRepeatPassword") }</label>
                <input ref={repeatPassword} type="password" id="repeat-password" className='w-full p-2 border-2 border-black dark:border-white rounded-md bg-transparent' />
                <span className="block w-full p-2 text-sm font-extrabold invisible">AAAAAAAAAA</span>
              </div>
              <div className="w-8/12 flex justify-between">
                <span></span>
                <span onClick={toggleFormType} className="underline cursor-pointer text-sm text-the-accent-color">{t("home.registerLink")}</span>
              </div>
              <button onClick={register} className='bg-the-accent-color text-white dark:bg-white py-2 px-4 mt-6 dark:text-black font-semibold cursor-pointer rounded-full hover:bg-indigo-800 dark:hover:bg-slate-100/70 transition-colors'>
                {t("home.registerButton")}
              </button>
            </>
          )}
          <hr className='w-8/12 mt-6 border-t-2 border-black dark:border-white'/>
          <button onClick={login} className='w-8/12 bg-the-accent-color text-white dark:bg-white py-2 px-4 mt-6 dark:text-black font-semibold cursor-pointer rounded-full hover:bg-indigo-800 dark:hover:bg-slate-100/70 transition-colors'>
            <div className='flex items-center justify-center'>
              <GoogleLogo className="h-8" />
              <span className='text-center h-full ml-2'>{t("home.googleButton")}</span>
            </div>
          </button>
        </aside>
      </main>
    </>
  );
}

export default Home;