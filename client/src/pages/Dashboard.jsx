// import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

import axios from 'axios'

import DarkIcon from '../assets/icons/dark-agility'
import LightIcon from '../assets/icons/light-agility'

import ProjectCard from '../components/ProjectCard'
import CreateProject from '../components/CreateProject'
import SearchProjects from '../components/SearchProjects'
import UserMenu from '../components/UserMenu'

import ThemeDetector from '../components/ThemeDetector'

import { useEffect, useRef, useState } from 'react'
import useOnScreen from '../customHooks/useOnScreen'
import { useTranslation } from 'react-i18next'

const Dashboard = () => {
  const createProjectRef = useRef(null)
  const userBtnRef = useRef(null)
  const lightIconRef = useRef(null)
  const darkIconRef = useRef(null)

  const { t } = useTranslation()

  const [ isUserMenuOpen, setIsUserMenuOpen ] = useState(false)
  const [isCreateProjectShown, setIsCreateProjectShown] = useState(false);

  const handleCloseCreateProject = () => {
    setIsCreateProjectShown(false);
  };

  const [ isSearchProjectsShown, setIsSearchProjectsShown ] = useState(false);

  const handleCloseSearchProjects = () => {
    setIsSearchProjectsShown(false);
  }

  const [ projects, setProjects ] = useState([])

  const [ theme, toggleTheme ] = useState('dark')
  useEffect(() => {
    handleResize()

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
  }, [])

  useEffect(() => {
		if (window.localStorage.getItem('theme')) {
			const storageTheme = window.localStorage.getItem('theme')
			if (storageTheme === 'dark') document.documentElement.classList.add('dark')
			else document.documentElement.classList.remove('dark')
		} else {
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => toggleTheme(e.matches ? 'dark' : 'light'))
			// Crear un evento.
			toggleTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
			// document.documentElement.classList.add(
			// 	window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
			// )
	
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				document.documentElement.classList.add('dark')
			} else {
				document.documentElement.classList.remove('dark')
			}

			window.localStorage.setItem('theme', theme)
	
			return () => {
				window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', e => setTheme(e.matches ? 'dark' : 'light'))
			}
		}
	}, [])

  //TODO: evitar que se haga cada vez la petición
  useEffect(() => {
    if (projects.length === 0) {
      axios
        .post(`${import.meta.env.VITE_API_ROUTE}/getProjects`, {
          token: localStorage.getItem("userToken"), // localStorage.getItem('token')
        })
        .then(res => {
          res = res.data
          console.log(res.result)
          if (res.status === "OK") setProjects(res.result)
        })
    }
  }, [projects])

  const [rendered, setRendered] = useState(false);
  // const darkIconRef = useRef(null);
  // const lightIconRef = useRef(null);

  const isDarkRendered = useOnScreen(darkIconRef);
  const isLightRendered = useOnScreen(lightIconRef);

  useEffect(() => {
    setRendered(isDarkRendered || isLightRendered);
  }, [isDarkRendered, isLightRendered]);

  function handleResize() {
    const width = window.innerWidth;
    if (lightIconRef.current || darkIconRef.current) {
      const lightIconPath = lightIconRef.current?.querySelector('path:nth-of-type(2)');
      const darkIconPath = darkIconRef.current?.querySelector('path:nth-of-type(2)');

      if (width < 768) {
        if (lightIconPath) lightIconPath.style.display = 'none';
        if (darkIconPath) darkIconPath.style.display = 'none';
      } else {
        if (lightIconPath) lightIconPath.style.display = 'block';
        if (darkIconPath) darkIconPath.style.display = 'block';
      }
    }
  };

  useEffect(() => {

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [darkIconRef, lightIconRef]);

  const [ searchValue, setSearchValue ] = useState('')

  const [ results, setResults ] = useState([])

  useEffect(() => {
    const newResults = projects.filter(project => project.title.toLowerCase().includes(searchValue.toLowerCase()))

    if (newResults.length === 0) setResults(["No s'han trobat resultats"])
    else setResults(newResults)
  }, [searchValue, projects])

  return (
    <>
      <Helmet>
        <title>{ t('dashboard.seoTitle') }</title>
        <meta name="description" content={ t('dashboard.seoDescription') } />
        <link rel="canonical" href="https://agility.ieti.site/dashboard" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={ t('dashboard.seoTitle') } />
        <meta property="og:description" content={ t('dashboard.seoDescription') } />
        <meta property="og:image" content={ `http${ window.location.hostname === 'localhost' ? '' : 's'}://${window.location.host}/agility.webp` } />
        <meta property="og:url" content="permalink" />
      </Helmet>
      <ThemeDetector theme={ theme } setTheme={ toggleTheme } />  
      <main 
        className="
          grid grid-rows-[82px_1fr] overflow-hidden gap-4 relative
          w-screen h-screen xl:p-4 box-border font-body transition-[padding]
          bg-gradient-to-t from-light-primary-bg/80 to-light-primary-bg dark:from-black dark:to-dark-primary-bg"
      >
        <header 
          className='
            p-5 xl:mr-8 rounded-md relative 
            flex items-center justify-between
            bg-light-secondary-bg dark:bg-dark-secondary-bg'
        >
          {
            theme === 'light'
              && <LightIcon ref={ lightIconRef } className={`w-64 h-auto`} />
          }
          {
            theme === 'dark'
              && <DarkIcon ref={ darkIconRef } className={`w-64 h-auto`} />
          }

          <button
            id="create-project-button"
            className='bg-the-accent-color flex items-center justify-center rounded-md px-3 py-2 text-white font-medium hover:scale-105 transition-all gap-2 absolute right-1/2 translate-x-1/2'
            onClick={() => setIsCreateProjectShown(!isCreateProjectShown)}
          >
            <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            <span className='hidden lg:block'>{ t('dashboard.createProjectBtn') }</span>
          </button>

          <span className="flex h-full relative">
            <svg className='hidden md:block absolute top-1/2 -translate-y-1/2 left-4' width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            <input 
              onFocus={() => setIsSearchProjectsShown(true)}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-light-tertiary-bg rounded-md h-fit px-3 py-2 pl-12 outline-none hidden md:flex items-center" 
              type="search" 
              name="search-in-projects" 
              id="search-in-projects" 
              placeholder={ t('dashboard.searchProjects') } 
            />
            <div className='w-[1px] h-full border-l-2 border-black dark:border-white/80 mx-6'></div>
            <button ref={ userBtnRef } onClick={() => setIsUserMenuOpen(true)} className="bg-[#d7d7d7] size-12 flex items-center justify-center rounded-full overflow-hidden">
              pfp<br />icon
            </button>
          </span>
        </header>
        <section 
          style={{ width: '100vw' }}
          className="
            p-5 rounded-md overflow-y-scroll
            flex flex-col items-center"
        >
          <span className='relative flex md:hidden mb-4'>
            <svg className='block absolute top-1/2 -translate-y-1/2 left-4' width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            <input 
              onFocus={() => setIsSearchProjectsShown(true)}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-light-tertiary-bg border-2 border-black dark:border-transparent rounded-md h-fit px-3 py-2 pl-12 outline-none flex items-center" 
              type="search" 
              name="search-in-projects" 
              id="search-in-projects" 
              placeholder={ t('dashboard.searchProjects') } 
            />
          </span>
          <h1 className="font-title font-extrabold text-5xl mb-8 text-black dark:text-white">{ t('dashboard.title') }</h1>

          <section className='grid lg:grid-cols-3 w-full gap-8 md:px-24 px-6 sm:grid-cols-2 grid-cols-1'>
            {projects && projects.map((project, index) => {
              return (
                <ProjectCard project={project} key={index} />
              )
            })}
          </section>
        </section>

        {// All the modals:
          isCreateProjectShown
            && <CreateProject ref={createProjectRef} onClose={handleCloseCreateProject} />
        }

        {
          isSearchProjectsShown
            && <SearchProjects onClose={handleCloseSearchProjects} projects={results} />
        }

        {
          isUserMenuOpen
            && <UserMenu theme={ theme } setTheme={ toggleTheme } setIsUserMenuOpen={setIsUserMenuOpen} isUserMenuOpen={isUserMenuOpen} />
        }
      </main>
    </>
  )
}

export default Dashboard