//TODO: 

import { useState, useEffect, useRef } from 'react'

import axios from 'axios'

import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import PageNotFound from '../pages/404'

import ArrowIcon from '../assets/icons/arrow'

import TableIcon from '../assets/icons/table'

import SprintBoard from '../components/project/SprintBoard'

import TaskTable from '../components/project/TaskTable'
import { use } from 'i18next'

const Project = () => {
  const { projectID } = useParams();

  const [ section, setSection ] = useState("SprintBoard") // TODO: setSection para setear si estamos en SprintBoard o estamos en Table o Chat.

  const [ currProject, setCurrProject ] = useState(null)

  const [ projectState, setProjectState ] = useState("200")

  const [ isAsideOpen, setIsAsideOpen ] = useState(true)

  const [ ws, setWs ] = useState(null)
  const asideRef = useRef(null)
  const [ tasks, setTasks ] = useState([])
  const [ isEditingTitle, setIsEditingTitle ] = useState(false)

  const currentBoardTitleRef = useRef(null)
  const newBoardTitleInputRef = useRef(null)

  const [ sprints, setSprints ] = useState([])

  const WS_URL = 'ws://localhost:3000'

  useEffect(() => {
    const ws = new WebSocket(WS_URL)
    ws.onopen = () => {
      setWs(ws)
      ws.onmessage = messageCallbacks
      // ws.send(JSON.stringify({ type: 'bounce', text: "AAAAAAAAAAAAAAAAAAAA" }))
    }
  }, [])

  useEffect(() => {
    if (ws) {
      joinProject()
    }
  }, [ws])

  function messageCallbacks(message) {
    const data = JSON.parse(message.data)
    console.log("DATA")
    console.log(data)
    if (data.type == "projectData") {
      if (currProject == null) {
        setCurrProject(data.project)
        setProjectState("200")
      }
    }
  }

  const joinProject = () => {
    ws.send(JSON.stringify({
      type: 'joinProject',
      projectID: projectID
    }))
  }

  useEffect(() => {
    if (currProject) {
      setSprints(Object.values(currProject.sprints))
      let sprint = Object.values(currProject.sprints).at(-1)
      setLatestSprint(sprint)
      console.log(Object.values(sprint.tasks))
      setTasks(Object.values(sprint.tasks))
    }
  }, [currProject])

  useEffect(() => {
    asideRef.current.classList.toggle('closed')
  }, [isAsideOpen])
  /*
  const getProject = () => {
    if (!projectID) {
      console.log(projectID)
      setProjectState("404")
    }
    else {
      console.log(projectID)
      axios
        .post('http://localhost:3000/getProject', { // Conseguiré el project con la id que tengo
          token: localStorage.getItem('userToken'),
          projectID: projectID,
        })
        .then(res => { 
          res = res.data
          console.log(res.result);
          setCurrProject(res.result);
          setProjectState("200");
        }) // Comprobar si el usuario tiene permiso para acceder al proyecto.
        .catch(() => {
          setProjectState("404"); 
          console.log("No s'ha pogut carregar el projecte.")
        }) // tiene que ser 404
    }
  }

  const getSprints = () => {
    axios
      .post('http://localhost:3000/getSprintBoards', {
        token: localStorage.getItem('userToken'),
        projectID: projectID,
      })
      .then(res => {
        res = res.data
        if (res.status === "OK") {
          setSprints(res.result)
          setLatestSprint(sprints.at(-1))
          getTasks()

          renderCurrentSprint("latest")
        }
      })
      .catch(() => console.error('No s\'han pogut carregar els sprints'))
  }
  */

  const [ latestSprint, setLatestSprint ] = useState({})

  const getLatestSprint = () => { // TODO(Pol): test it.
    // const dates = []
    // sprints.forEach(sprint => dates.push(new Date(sprint.date)))

    // const max = new Date(Math.max.apply(null, dates))

    // const latestSprint = sprints.find(sprint => sprint.date === max)

    console.log("holaaaaaaaaaaaaaaaaaaa", sprints)

    setLatestSprint([...sprints][sprints.length - 1])
  }

  /*
  const getTasks = () => {
    axios
      .post('http://localhost:3000/getTasksInSprint', {
        token: localStorage.getItem('userToken'),
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
  }*/

  //const [ currentSprint, setLatestSprint ] = useState(null)

  const renderCurrentSprint = (sprintID) => {
    if (sprintID === "latest" || latestSprint === null) {
      setLatestSprint(latestSprint)
    }
    else {
      setLatestSprint(sprints.find(sprint => sprint._id === sprint))
    }
  }

  useEffect(() => {
    //getProject();
  }, []);
  
  useEffect(() => {
    if (projectState === "200") {
      //getSprints();
    }
  }, [projectState]);
  
  useEffect(() => {
    if (sprints.length > 0) {
      //getLatestSprint();
    }
  }, [sprints]);

  useEffect(() => {
    //getTasks()
  }, [latestSprint])

  const discardNewTitle = () => {
    setIsEditingTitle(false)
    newBoardTitleInputRef.current.value = ''
  }

  const acceptNewTitle = () => {
    // TODO: acceptNewTitle function
  }

  const [ isCreatingSprintBoard, setIsCreatingSprintBoard ] = useState(false)
  const createSprintTitleRef = useRef()

  const cancelCreateSprintBoard = () => {
    setIsCreatingSprintBoard(false)
    createSprintTitleRef.current.value = ''
  }

  const createSprintBoard = () => {
    if (createSprintTitleRef.current.value !== '') {
      ws.send(JSON.stringify({
        type: 'createSprintBoard',
        projectID: projectID,
        sprintName: createSprintTitleRef.current.value,
      }))
      /*
      axios
        .post('http://localhost:3000/createSprintBoard', {
          token: localStorage.getItem("userToken"),
          projectID: projectID,
          name: createSprintTitleRef.current.value,
        })
          .then(res => {
            res = res.data
            if (res.status === "OK") {
              getSprints()
              getLatestSprint()
              cancelCreateSprintBoard()
            }
          })
      */
    } // TODO: else que haga una notificación q no pde estar vacío.
  }

  const changeBoard = (e) => {
    const targetSprint = sprints.filter(sprint => sprint._id === e.target.dataset.id)

    if (targetSprint.length > 0) {
      setLatestSprint(targetSprint[0])
    }
  }

  return (
    <>
      <Helmet>
          <title>{ currProject ? currProject.title : 'Cargando projecto...' } | Agility</title>
      </Helmet>
      { projectState === "404" && <PageNotFound /> }
      { projectState === "403" && <h1>403</h1> /* Hacer página de 403 y estilar la de 404!!! */ }

      { projectState === "200" && (
        <section id='dashboard-section' className="bg-light-primary-bg p-2 gap-2 overflow-hidden max-h-screen">
          <aside id='dashboard-aside' ref={asideRef} className="closed bg-light-secondary-bg relative transition-all rounded-lg flex flex-col p-5 box-border">
            <ArrowIcon onClick={() => setIsAsideOpen(!isAsideOpen)} className={`rounded-full bg-purple-800 absolute -right-[15px] top-1/2 bototm-1/2 -translate-y-1/2 transition-all hover:cursor-pointer ${isAsideOpen ? 'rotate-180' : ''}`} />

            <section className='h-fit pb-[21px] border-b-2 flex overflow-hidden mb-3'>
              <span className="flex size-16 mr-5 bg-black row-span-2 rounded-md box-border">a</span>
              <span className='my-auto'>{ currProject ? currProject.title : "Título mal." }</span>
            </section>
            
            <nav className='flex-1 flex flex-col'>
              <button onClick={() => setSection("TaskTable")} className="w-full text-left px-3 py-2 flex items-center gap-5">
                <TableIcon></TableIcon>
                  Tabla
              </button>

              <span className='font-bold text-2xl'>
                Sprints
              </span>

              <ul className='relative flex flex-col gap-3 box-border overflow-hidden overflow-y-scroll flex-1 mt-4 pr-4'>
                {sprints.map(sprint => (
                  <li className='w-full bg-light-tertiary-bg text-black rounded-lg' key={sprint._id}>
                    <button onClick={(e) => changeBoard(e)} className="w-full h-full text-left px-3 py-2 flex items-center gap-5" data-id={sprint._id}>
                      <span className='grid size-[45px] rounded-full bg-white'></span>
                        { sprint.name }
                    </button>
                  </li>
                ))}
                {
                  isCreatingSprintBoard && (
                    <li className='w-full bg-light-tertiary-bg text-black rounded-lg relative border-green-500 border-2'>
                      <button onClick={() => cancelCreateSprintBoard()} className='absolute top-0 right-0 text-white bg-red-500 hover:bg-red-700 rounded-full' title='Discard'>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                      </button>
                      <div onClick={() => createSprintBoard()} className="w-full h-full text-left px-3 py-2 flex items-center gap-5">
                        <button className='bg-green-500 hover:bg-green-700 text-white rounded-full' title='Accept change'>
                          <svg width="45" height="45" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045ZM1.82708 7.49988C1.82708 4.36686 4.36689 1.82704 7.49991 1.82704C10.6329 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6329 13.1727 7.49991 13.1727C4.36689 13.1727 1.82708 10.6329 1.82708 7.49988ZM10.1589 5.53774C10.3178 5.31191 10.2636 5.00001 10.0378 4.84109C9.81194 4.68217 9.50004 4.73642 9.34112 4.96225L6.51977 8.97154L5.35681 7.78706C5.16334 7.59002 4.84677 7.58711 4.64973 7.78058C4.45268 7.97404 4.44978 8.29061 4.64325 8.48765L6.22658 10.1003C6.33054 10.2062 6.47617 10.2604 6.62407 10.2483C6.77197 10.2363 6.90686 10.1591 6.99226 10.0377L10.1589 5.53774Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        </button>
                        <input className='w-full' type="text" name="create-sprint-title" id="create-sprint-title" placeholder='Insert sprint title' ref={ createSprintTitleRef } />
                      </div>
                    </li>
                  )
                }
              </ul>
              <button 
                onClick={() => setIsCreatingSprintBoard(true)}
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
                { latestSprint ? latestSprint.name : "Título mal."}
              </h1>

              <span className={`${isEditingTitle ? 'flex' : 'hidden'} gap-2`}>
                <input 
                  ref={newBoardTitleInputRef} 
                  type='text' 
                  className={`rounded-lg bg-light-secondary-bg border-2 border-black box-border transition-all ${isEditingTitle ? 'flex' : 'hidden'}`}
                />
                <button 
                  className='py-2 px-4 bg-slate-500 rounded-lg'
                  onClick={() => acceptNewTitle()}
                >
                  Save
                </button>
                <button 
                  className='py-2 px-4 bg-slate-500 rounded-lg'
                  onClick={() => discardNewTitle()}
                >
                  Discard
                </button>
              </span>

              <span>

              </span>
            </header>
            <section id="main-project-container" className={`${section !== "TaskTable" && "nice-gradient grid-cols-4"} bg-light-secondary-bg rounded-lg overflow-hidden grid max-h-full content-between p-5`}>
              {
                section === "SprintBoard" 
                  && <SprintBoard projectID={ projectID } latestSprint={ latestSprint } tasks={ tasks } webSocket={ ws } />
              }
              {
                section === "TaskTable"
                  && <TaskTable tasks={ tasks } />
              }
            </section>
          </main>
        </section>
      ) }
    </>
  )
}

export default Project