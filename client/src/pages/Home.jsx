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
import ThemeDetector from '../components/ThemeDetector'
// import { useTheme } from '../custom-hooks/useTheme'

const Home = () => {
  const { t } = useTranslation()

  const [ theme, toggleTheme ] = useState('dark')

  const [ formType, setFormType ] = useState('login')
  const [ user, setUser ] = useState([])
  const [ error, setError ] = useState({field: '', message: ''})
  const email = useRef(null)
  const username = useRef(null)
  const password = useRef(null)
  const password2 = useRef(null)

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

  const toggleFormType = () => {
    setError({field: '', message: ''})
    setFormType((prevFormType) => (prevFormType === 'login' ? 'register' : 'login'));
  }

  const login = () => {
    axios
      .post(`${import.meta.env.VITE_API_ROUTE}/login`, {
        email: email.current.value,
        password: password.current.value
      })
      .then((res) => {
        res = res.data
        if (res.status == "OK") {
          localStorage.setItem('userToken', res.token)
          window.location.href = '/dashboard'
        } else {
          console.log(res)
          if (res.result == "WRONG USER") {
            setError({field: 'emailLogin', message: 'Usuario no encontrado'})
          } else if (res.result == "WRONG PASSWORD") {
            setError({field: 'passwordLogin', message: 'Contraseña incorrecta'})
          } else if (res.result == "GOOGLE REGISTER") {
            setError({field: 'passwordLogin', message: 'Este usuario se registró con Google, inicia sesión con Google'})
          }
        }
        console.log(error)
      })
  }

  const register = () => {
    if (username.current.value == "") {
      setError({field: 'usernameRegister', message: 'Inserte un nombre de usuario'})
      return
    }
    if (email.current.value == "") {
      setError({field: 'emailRegister', message: 'Inserte una dirección de correo electrónico'})
      return
    }
    if (password.current.value == "") {
      setError({field: 'passwordRegister', message: 'Inserte una contraseña'})
      return
    } else if (password.current.value.length < 8) {
      setError({field: 'passwordRegister', message: 'La contraseña debe tener al menos 8 caracteres'})
      return
    } else if (!/[A-Z]/.test(password.current.value)) {
      setError({field: 'passwordRegister', message: 'La contraseña debe tener al menos una letra mayúscula'})
      return
    } else if (!/[a-z]/.test(password.current.value)) {
      setError({field: 'passwordRegister', message: 'La contraseña debe tener al menos una letra minúscula'})
      return
    } else if (!/[0-9]/.test(password.current.value)) {
      setError({field: 'passwordRegister', message: 'La contraseña debe tener al menos un número'})
      return
    } else if (!/[!@#$%^&*]/.test(password.current.value)) {
      setError({field: 'passwordRegister', message: 'La contraseña debe tener al menos un caracter especial'})
      return
    }
    if (password2.current.value == "") {
      setError({field: 'repeatPassword', message: 'Confirme su contraseña'})
      return
    }
    if (password.current.value != password2.current.value) {
      setError({field: 'repeatPassword', message: 'Las contraseñas no coinciden'})
      return
    }
    axios
      .post(`${import.meta.env.VITE_API_ROUTE}/register`, {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value
      })
      .then((res) => {
        res = res.data
        if (res.status == "OK") {
          localStorage.setItem('userToken', res.token)
          window.location.href = '/dashboard'
        } else {
          if (res.result == "USER EXISTS") {
            setError({field: 'emailRegister', message: 'Este correo electrónico ya está registrado'})
          }
        }
      })
  }

  

  const loginGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  const googleLoginCallback = (userData) => {
    if (userData) {
      axios
        .post(`${import.meta.env.VITE_API_ROUTE}/googleLogin`, userData)
        .then((res) => {
          res = res.data
          localStorage.setItem('userToken', res.token)
          window.location.href = '/dashboard'
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

  useEffect(() => {
    document.documentElement.style.overflowX = 'hidden'
  }, [])

  return (
    <>
      <Helmet>
        <title>{t("home.seoTitle")}</title>
        <meta name="description" content={t("home.seoDescription")} />
      </Helmet>
      <ThemeDetector theme={ theme } setTheme={ toggleTheme } />
      <main 
        className="
          min-h-screen w-screen xl:p-4 box-border font-body transition-[padding]
          bg-gradient-to-t from-light-primary-bg/80 to-light-primary-bg text-black dark:from-black dark:to-dark-primary-bg dark:text-white
          grid grid-cols-[1fr] grid-rows-[35%_65%] xl:grid-cols-[4fr_2fr] xl:grid-rows-[1fr] xl:gap-4 overflow-x-hidden
        "
      >
        {/* <!--  bg-white text-black dark:bg-[#100C12] dark:text-white  --> */}
        
        <section className="relative bg-light-secondary-bg dark:bg-dark-secondary-bg/80 px-6 py-14 flex flex-col items-center justify-center rounded-none xl:rounded-md">
          {/* <LanguageChanger props={true} className={`flex absolute right-0 top-0 xl:hidden`} /> */}

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
          <ThemeToggler theme={ theme } setTheme={ toggleTheme } className={theme === 'dark' ? "from-transparent to-white" : "from-the-accent-color"} onClick={() => toggleTheme(theme)}/>
          <LanguageChanger className={`hidden xl:flex`} />
          {formType === 'login' && (
            <>
              <h1 className='text-3xl font-bold font-subtitle mt-12'>{ t("home.loginMessage") }</h1>
              <div className="form-group w-8/12 mt-6">
                <label htmlFor="email" className='text-lg'>{ t("home.loginUsername") }</label>
                <input ref={email} type="email" id="email" className='w-full p-2 border-2 border-black dark:border-white rounded-md bg-transparent' />
                <span className={`block w-full p-2 text-sm font-extrabold h-8 ${error.field === "emailLogin" ? "text-red-500" : "text-transparent"}`}> {(error.field === "emailLogin" ? error.message : "")}</span>
              </div>
              <div className="form-group w-8/12 mt-6">
                <label htmlFor="password" className='text-lg'>{ t("home.loginPassword") }</label>
                <input ref={password} type="password" id="password" className='w-full p-2 border-2 border-black dark:border-white rounded-md bg-transparent' />
                <span className={`block w-full p-2 text-sm font-extrabold h-8 ${error.field === "passwordLogin" ? "text-red-500" : "text-transparent"}`}> {(error.field === "passwordLogin" ? error.message : "")}</span>
              </div>
              <button onClick={login} className='bg-the-accent-color text-white dark:bg-white py-2 px-4 mt-6 dark:text-black font-semibold cursor-pointer rounded-full hover:bg-indigo-800 dark:hover:bg-slate-100/70 transition-colors'>
                {t("home.loginButton")}
              </button>
              <div className="w-8/12 flex justify-center">
                <span onClick={toggleFormType} className="underline cursor-pointer text-sm text-the-accent-color">{t("home.registerLink")}</span>
              </div>
            </>
          )}
          {formType === 'register' && (
            <>
              <h1 className='text-3xl font-bold font-subtitle'>{ t("home.registerMessage") }</h1>
              <div className="form-group w-8/12 mt-6">
                <label htmlFor="username" className='text-lg'>{ t("home.registerUsername") }</label>
                <input ref={username} maxLength={20} type="text" id="username" className='w-full p-2 border-2 border-black dark:border-white rounded-md bg-transparent' />
                <span className={`block w-full p-2 text-sm font-extrabold h-8 ${error.field === "usernameRegister" ? "text-red-500" : "text-transparent"}`}> {(error.field === "usernameRegister" ? error.message : "")}</span>
              </div>
              <div className="form-group w-8/12 mt-1">
                <label htmlFor="email" className='text-lg'>{ t("home.registerEmail") }</label>
                <input ref={email} maxLength={100} type="email" id="email" className='w-full p-2 border-2 border-black dark:border-white rounded-md bg-transparent' />
                <span className={`block w-full p-2 text-sm font-extrabold h-8 ${error.field === "emailRegister" ? "text-red-500" : "text-transparent"}`}> {(error.field === "emailRegister" ? error.message : "")}</span>
              </div>
              <div className="form-group w-8/12 mt-1">
                <label htmlFor="password" className='text-lg'>{ t("home.registerPassword") }</label>
                <input ref={password} maxLength={20} type="password" id="password" className='w-full p-2 border-2 border-black dark:border-white rounded-md bg-transparent' />
                <span className={`block w-full p-2 text-sm font-extrabold h-8 ${error.field === "passwordRegister" ? "text-red-500" : "text-transparent"}`}> {(error.field === "passwordRegister" ? error.message : "")}</span>
              </div>
              <div className="form-group w-8/12 mt-1">
                <label htmlFor="repeat-password" className='text-lg'>{ t("home.registerRepeatPassword") }</label>
                <input ref={password2} maxLength={20} type="password" id="repeat-password" className='w-full p-2 border-2 border-black dark:border-white rounded-md bg-transparent' />
                <span className={`block w-full p-2 text-sm font-extrabold h-8 ${error.field === "password2" ? "text-red-500" : "text-red"}`}> {(error.field === "password2" ? error.message : "")}</span>
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
          <button onClick={loginGoogle} className='w-8/12 bg-the-accent-color text-white dark:bg-white py-2 px-4 mt-6 dark:text-black font-semibold cursor-pointer rounded-full hover:bg-indigo-800 dark:hover:bg-slate-100/70 transition-colors'>
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