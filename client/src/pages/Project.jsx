//TODO: 

import { useState, useEffect, useRef } from 'react'

import axios from 'axios'

import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import PageNotFound from '../pages/404'

import ArrowIcon from '../assets/icons/arrow'

import TaskCard from '../components/project/TaskCard'

const Project = () => {
  const { projectID } = useParams(undefined);

  // const { project, setProject } = useState({})

  const [ projectState, setProjectState ] = useState("200")

  const [ isAsideOpen, setIsAsideOpen ] = useState(true)
  const asideRef = useRef(null)

  useEffect(() => {
    asideRef.current.classList.toggle('closed')
  }, [isAsideOpen])

  const getProject = () => {
    if (projectID === undefined) {
      console.log(projectID)
      setProjectState("404")
    }
    else {
      console.log(projectID)
      axios
        .post('http://localhost:3000/getProjects', { // Conseguiré el project con la id que tengo
          token: 'WjGoEb_4VsUkC9vT3zPh6NmKJMl77ayn',
          projectID: projectID,
        })
        .then(data => {console.table(data); setProjectState("200");}) // Comprobar si el usuario tiene permiso para acceder al proyecto.
        .catch(() => {setProjectState("404"); console.log("No s\'ha pogut carregar el projecte.")}) // tiene que ser 404
    }
  }

  const [ isEditingTitle, setIsEditingTitle ] = useState(false)

  const currentBoardTitleRef = useRef(null)
  const newBoardTitleInputRef = useRef(null)

  const [ sprints, setSprints ] = useState([])

  const getSprints = () => {
    axios
      .post('http://localhost:3000/getSprintBoards', {
        token: 'WjGoEb_4VsUkC9vT3zPh6NmKJMl77ayn',
        projectID: projectID,
      })
      .then(res => {
        res = res.data
        console.log(res.result)
        if (res.status === "OK") {
          let reformattedRes = res.result.map(({_id, projectID, name, date}) => ({ _id: _id, projectID: projectID, name: name, date: new Date(date)}))
          setSprints(reformattedRes)
        }
      })
      .catch(() => console.log('No s\'han pogut carregar els sprints'))
  }

  const [ latestSprint, setLatestSprint ] = useState({})

  const getLatestSprint = () => { // TODO(Pol): test it.
    // const dates = [new Date("2024-03-20T18:31:12.158+00:00")]
    const dates = []
    sprints.forEach(sprint => dates.push(new Date(sprint.date)))

    const max = new Date(Math.max.apply(null, dates))

    const latestSprint = sprints.find(sprint => sprint.date === max)

    setLatestSprint(latestSprint)
  }

  const [ tasks, setTasks ] = useState([])

  const getTasks = () => {
    axios
      .post('http://localhost:3000/getTasksInSprint', {
        token: 'WjGoEb_4VsUkC9vT3zPh6NmKJMl77ayn',
        projectID: projectID,
        sprintName: latestSprint.name,
      })
        .then(res => {
          res = res.data
          if (res.status === "OK") setTasks(res.result)
        })
        .catch(() => {
          setTasks([])
          console.log('No s\'han pogut carregar les tasques')
        })
  }

  const [ currentSprint, setCurrentSprint ] = useState(null)

  const renderCurrentSprint = (sprintID) => {
    if (sprintID === "latest" || currentSprint === null) {
      setCurrentSprint(latestSprint)
    }
    else {
      setCurrentSprint(sprints.find(sprint => sprint._id === sprint))
    }
  }

  useEffect(() => {
    getProject();
    if (projectState === "200") {
      getSprints()
      getLatestSprint()
      getTasks()

      renderCurrentSprint("latest")
    }
  }, [])



  return (
    <>
      <Helmet>
          <title>Project name | Agility</title>
      </Helmet>
      { projectState === "404" && <PageNotFound /> }
      { projectState === "403" && <h1>403</h1> /* Hacer página de 403 y estilar la de 404!!! */ }

      { projectState === "200" && (
        <section id='dashboard-section' className="bg-light-primary-bg p-2 gap-2 overflow-hidden max-h-screen">
          <aside id='dashboard-aside' ref={asideRef} className="closed bg-light-secondary-bg relative transition-all rounded-lg flex flex-col p-5 box-border">
            <ArrowIcon onClick={() => setIsAsideOpen(!isAsideOpen)} className={`rounded-full bg-purple-800 absolute -right-[15px] top-1/2 bototm-1/2 -translate-y-1/2 transition-all hover:cursor-pointer ${isAsideOpen ? 'rotate-180' : ''}`} />

            <section className='h-fit pb-[21px] border-b-2 flex overflow-hidden mb-3'>
              <span className="flex size-16 mr-5 bg-black row-span-2 rounded-md box-border">a</span>
              <span className='my-auto'>Nom del projecte</span>
            </section>
            
            <nav className='flex-1 flex flex-col'>
              <span className='font-bold text-2xl'>
                Sprints
              </span>

              <ul className='relative flex flex-col gap-3 box-border overflow-hidden overflow-y-scroll flex-1 mt-4 pr-4'>
                {sprints.map((sprint, key) => (
                  <li className='w-full bg-light-tertiary-bg text-black rounded-lg' key={key}>
                    <button className="w-full h-full text-left px-3 py-2 flex items-center gap-5">
                      <span className='grid size-[45px] rounded-full bg-white'></span>
                        { sprint }
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className='mt-5 bg-the-accent-color flex items-center justify-center rounded-md px-3 py-2 text-white font-medium hover:scale-105 transition-all gap-2'
              >
                <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                Afegir tauler
              </button>
            </nav>
          </aside>
          <main id='main-dashboard' className='gap-2 box-border transition-all rounded-lg'>
            <header className='bg-light-secondary-bg rounded-lg flex items-center justify-between p-5'>
              <h1 
                ref={currentBoardTitleRef}
                title='Double click to edit the title.'
                onDoubleClick={() => setIsEditingTitle(true)}
                className={`text-3xl font-bold text-black box-border bg-light-secondary-bg rounded-lg hover:cursor-pointer hover:bg-light-primary-bg transition-all ${isEditingTitle ? 'hidden' : 'flex'}`}
              >
                Títol de l&apos;sprint
              </h1>

              <span>
                <input 
                  ref={newBoardTitleInputRef} 
                  type='text' 
                  className={`rounded-lg bg-light-secondary-bg border-2 border-black box-border transition-all ${isEditingTitle ? 'flex' : 'hidden'}`}
                />
              </span>

              <span>

              </span>
            </header>
            <section id="main-project-container" className='bg-light-secondary-bg rounded-lg overflow-hidden grid max-h-full grid-cols-4 content-between p-5'>
              <div className='flex flex-col align-center justify-center p-5 bg-light-secondary-bg max-w-[330px] rounded-lg'>
                <h3 className='font-subtitle font-bold text-2xl mb-5'>To-do</h3>
                <ul className='flex flex-col rounded-lg overflow-hidden h-full max-h-full pr-5 gap-5 flex-1 overflow-y-scroll'>
                  { tasks.map(task => <li key={task.key}><TaskCard text={task.text} /></li>) }
                </ul>
                <span className='flex justify-center border-t-2 border-black pt-4'>
                  <button
                    className='bg-the-accent-color flex items-center justify-center rounded-md px-3 py-2 text-white font-medium hover:scale-105 transition-all gap-2'
                  >
                    <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    Afegir tasca
                  </button>
                </span>
              </div>

              <div className='flex flex-col align-center justify-center p-5 bg-light-secondary-bg max-w-[330px] rounded-lg'>
                <h3 className='font-subtitle font-bold text-2xl mb-5'>Doing</h3>
                <ul className='flex flex-col rounded-lg overflow-hidden h-full max-h-full pr-5 gap-5 flex-1 overflow-y-scroll'>
                  { tasks.map(task => <li key={task.key}><TaskCard text={task.text} /></li>) }
                </ul>
                <span className='flex justify-center border-t-2 border-black pt-4'>
                  <button
                    className='bg-the-accent-color flex items-center justify-center rounded-md px-3 py-2 text-white font-medium hover:scale-105 transition-all gap-2'
                  >
                    <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    Afegir tasca
                  </button>
                </span>
              </div>

              <div className='flex flex-col align-center justify-center p-5 bg-light-secondary-bg max-w-[330px] rounded-lg'>
                <h3 className='font-subtitle font-bold text-2xl mb-5'>Testing</h3>
                <ul className='flex flex-col rounded-lg overflow-hidden h-full max-h-full pr-5 gap-5 flex-1 overflow-y-scroll'>
                  { tasks.map(task => <li key={task.key}><TaskCard text={task.text} /></li>) }
                </ul>
                <span className='flex justify-center border-t-2 border-black pt-4'>
                  <button
                    className='bg-the-accent-color flex items-center justify-center rounded-md px-3 py-2 text-white font-medium hover:scale-105 transition-all gap-2'
                  >
                    <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    Afegir tasca
                  </button>
                </span>
              </div>

              <div className='flex flex-col align-center justify-center p-5 bg-light-secondary-bg max-w-[330px] rounded-lg'>
                <h3 className='font-subtitle font-bold text-2xl mb-5'>Done</h3>
                <ul className='flex flex-col rounded-lg overflow-hidden h-full max-h-full pr-5 gap-5 flex-1 overflow-y-scroll'>
                  { tasks.map(task => <li key={task.key}><TaskCard text={task.text} /></li>) }
                </ul>
                <span className='flex justify-center border-t-2 border-black pt-4'>
                  <button
                    className='bg-the-accent-color flex items-center justify-center rounded-md px-3 py-2 text-white font-medium hover:scale-105 transition-all gap-2'
                  >
                    <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    Afegir tasca
                  </button>
                </span>
              </div>
            </section>
          </main>
        </section>
      ) }
    </>
  )
}

export default Project