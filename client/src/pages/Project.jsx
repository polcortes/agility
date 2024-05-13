//TODO: 

import { useState, useEffect, useRef } from 'react'

import axios from 'axios'

import { Toaster, toast } from 'sonner'

import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import PageNotFound from '../pages/404'

import ArrowIcon from '../assets/icons/arrow'

import TableIcon from '../assets/icons/table'
import ChatIcon from '../assets/icons/chat-icon'
import Chat from '../components/project/chat/Chat'

import SprintBoard from '../components/project/SprintBoard'

import TaskTable from '../components/project/TaskTable'

import ShareProjectModal from '../components/project/ShareProjectModal'
import EditSprintBoardModal from '../components/project/EditSprintBoardModal'
import UserMenu from '../components/UserMenu'

import ThemeDetector from '../components/ThemeDetector'

const Project = () => {
  const { projectID } = useParams();

  const [ theme, setTheme ] = useState('dark')

  const [ section, setSection ] = useState("SprintBoard") // TODO: setSection para setear si estamos en SprintBoard o estamos en Table o Chat.

  const [ currProject, setCurrProject ] = useState(null)

  const [ projectState, setProjectState ] = useState("200")

  const [ isAsideOpen, setIsAsideOpen ] = useState(true)

  const [ isShareProjectModalOpen, setIsShareProjectModalOpen ] = useState(false) // TODO: setear cuando se verá la modal de compartir proyecto
  const [ isEditSprintBoardOpen, setIsEditSprintBoardOpen ] = useState(false)

  const [ ws, setWs ] = useState(null)
  const asideRef = useRef(null)
  const [ tasks, setTasks ] = useState([])

  const currentBoardTitleRef = useRef(null)
  const newBoardTitleInputRef = useRef(null)

  const [ sprints, setSprints ] = useState([])

  const [ latestSprint, setLatestSprint ] = useState(null)

  const [ willChangeToSprintBoard, setWillChangeToSprintBoard ] = useState(false)

  const [ thisUser, setThisUser ] = useState(null)
  const [ otherUsers, setOtherUsers ] = useState([])
  
  const [ isUserMenuOpen, setIsUserMenuOpen ] = useState(false)
  const [ chat, setChat ] = useState([])

  const [ usersInProject, setUsersInProject ] = useState([])

  const mainProjectContainerRef = useRef(null)

  const WS_URL = import.meta.env.VITE_WS_ROUTE

  useEffect(() => {
    const ws = new WebSocket(WS_URL)
    ws.onopen = () => {
      setWs(ws)
      ws.onmessage = messageCallbacks
      // ws.send(JSON.stringify({ type: 'bounce', text: "AAAAAAAAAAAAAAAAAAAA" }))
    }
  }, [])

  useEffect(() => {
    console.log("WS", ws)
    if (ws) {
      joinProject()
    }
  }, [ws])

  const messageCallbacks = (message) => {
    const data = JSON.parse(message.data)
    console.log("DATA")
    console.log(data)
    console.log("currPRe", currProject)
    if (data.type == "projectData") {
      if (currProject == null) {
        setProjectState("200")
        console.log("latestSprint", latestSprint)
        let tasks = data.project.sprints
        console.log("tasks",tasks)
        //setTasks(tasks)
      }
      setCurrProject(data.project)
    } else if (data.type == "setLatestSprint") {
      setWillChangeToSprintBoard(true)
    }
  }

  const joinProject = () => {
    ws.send(JSON.stringify({
      type: 'joinProject',
      projectID: projectID,
      token: localStorage.getItem('userToken')
    }))
  }

  useEffect(() => {
    if (currProject) {
      console.log("THISUSER", currProject.users.find(user => user.token === localStorage.getItem('userToken')))
      setThisUser(currProject.users.find(user => user.token === localStorage.getItem('userToken')))
      setOtherUsers(currProject.users.filter(user => user.token !== localStorage.getItem('userToken')))
      if (currProject.invitedUsers) {
        setUsersInProject([currProject.creator, ...currProject.invitedUsers])
      } else {
        setUsersInProject([currProject.creator])
      }
      setChat(currProject.chat)
      let sprints = Object.values(currProject.sprints).sort((a, b) => a._id > b._id)
      setSprints(sprints)
      let sprint = sprints.at(-1)
      if (latestSprint == null) {
        setLatestSprint(sprint)
      } else {
        setLatestSprint(currProject.sprints[latestSprint.name])
      }
    }
    console.log("SPRINT", latestSprint)
  }, [currProject])

  useEffect(() => {
    if (willChangeToSprintBoard) {
      console.log("LAST", sprints.at(-1))
      setSection("SprintBoard")
      setLatestSprint(sprints.at(-1))
      setWillChangeToSprintBoard(false)
      setIsCreatingSprintBoard(false)
    }
  }, [sprints, willChangeToSprintBoard])

  useEffect(() => {
    console.log("LATEST", latestSprint)
    if (latestSprint && latestSprint.tasks) {
      console.log("TASKS", Object.values(latestSprint.tasks))
      setTasks(Object.values(latestSprint.tasks))
    } else if (latestSprint) {
      setTasks([])
    }
  }, [latestSprint])

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
  const getLatestSprint = () => { // TODO(Pol): test it.
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

  const [ isCreatingSprintBoard, setIsCreatingSprintBoard ] = useState(false)
  const createSprintTitleRef = useRef()

  const cancelCreateSprintBoard = () => {
    setIsCreatingSprintBoard(false)
    createSprintTitleRef.current.value = ''
  }

  const createSprintBoard = () => {
    if (createSprintTitleRef.current.value !== '') {
      setWillChangeToSprintBoard(true)
      ws.send(JSON.stringify({
        type: 'createSprintBoard',
        projectID: projectID,
        sprintName: createSprintTitleRef.current.value
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
              
              toast.success('Tauler creat correctament!', {
                duration: 3000,
                closeButton: true,
                position: 'bottom-right',
              });
            }
            else throw new Error(res.result)
          })
          .catch(err => {
            toast.info('The sprintboard couldn\'t be created.', {
              description: err,
              duration: 3000,
              closeButton: true,
              position: 'bottom-right',
            });
          })
          */
    } // TODO: else que haga una notificación q no pde estar vacío.
  }

  const changeBoard = (e) => {
    if (section !== 'SprintBoard') setSection('SprintBoard')
    const targetSprint = sprints.filter(sprint => sprint._id === e.target.dataset.id)
    console.log("TARGET", targetSprint)

    if (targetSprint.length > 0) {
      setLatestSprint(targetSprint[0])
    }
  }

  const deleteSprintboard = (sprint) => {
    if (sprints.length === 1) {
      toast.error('Hi ha d\'haver al menys un tauler al projecte.', {
        duration: 3000,
        position: 'bottom-right',
        closeButton: true,
      })
    } else {
      ws.send(JSON.stringify({
        type: 'deleteSprintBoard',
        projectID: projectID,
        sprintName: sprint
      }))
      if (latestSprint.name === sprint) {
        if (latestSprint === sprints[sprints.length-1])
          setLatestSprint(sprints[sprints.length-2])
        else
          setLatestSprint(sprints[sprints.length-1])
      }
      // Cuando esté bien:
      toast.success('S\'ha esborrat el tauler satisfactoriament.', {
        duration: 3000,
        position: 'bottom-right',
        closeButton: true,
      })
    }

    // Si no:
    /*
    toast.error('El tauler no s\'ha pogut esborrar.', {
      desc: err,  // El error?? Si quieres.
      duration: 3000,
      position: 'bottom-right',
      closeButton: true,
    })
    */
  }

  const [ sprintIsGonnaBeEdited, setSprintIsGonnaBeEdited ] = useState(null)

  const openSprintBoardEditor = (sprintID) => {
    const spri = sprints.find((sprint) => sprint._id === sprintID)
    setSprintIsGonnaBeEdited(spri)
    setIsEditSprintBoardOpen(true)
  }

  const editSprintboard = () => {
    // Cuando esté bien:
    toast.success('S\'ha editat el tauler satisfactoriament.', {
      duration: 3000,
      position: 'bottom-right',
      closeButton: true,
    })

    // Si no:
    /*
    toast.error('El tauler no s\'ha pogut editar correctament.', {
      desc: err,  // El error?? Si quieres.
      duration: 3000,
      position: 'bottom-right',
      closeButton: true,
    })
    */
  }

  return (
    <>
      <Helmet>
          <title>{ currProject ? currProject.title : 'Cargando projecto...' } | Agility</title>
      </Helmet>
      <ThemeDetector theme={ theme } setTheme={ setTheme } />

      { projectState === "404" && <PageNotFound /> }
      { projectState === "403" && <h1>403</h1> /* Hacer página de 403 y estilar la de 404!!! */ }

      { projectState === "200" && (
        <section id='dashboard-section' className="bg-light-primary-bg dark:bg-dark-primary-bg p-2 gap-2 overflow-hidden max-h-screen min-h-screen">
          <aside id='dashboard-aside' ref={asideRef} className="closed dark:text-white bg-light-secondary-bg dark:bg-dark-secondary-bg relative transition-all rounded-lg flex flex-col p-5 box-border">
            <ArrowIcon onClick={() => setIsAsideOpen(!isAsideOpen)} className={`z-50 rounded-full bg-purple-800 absolute -right-[15px] top-1/2 bototm-1/2 -translate-y-1/2 transition-all hover:cursor-pointer ${isAsideOpen ? 'rotate-180' : ''}`} />

            <section className='h-fit pb-[21px] border-b-2 flex overflow-hidden mb-3'>
              <span className="flex size-16 mr-5 bg-black row-span-2 rounded-md box-border">a</span>
              <span className='my-auto'>{ currProject ? currProject.title : "Título mal." }</span>
            </section>

            <nav className='flex-1 flex flex-col gap-1'>
              <button onClick={() => setSection("TaskTable")} className="hover:bg-light-tertiary-bg/90 dark:hover:bg-dark-tertiary-bg/90 rounded-md duration-100 dark:text-white w-full text-left px-3 py-2 flex items-center gap-5">
                <TableIcon></TableIcon>
                  Tabla
              </button>

              <button onClick={() => setSection("Chat")} className="hover:bg-light-tertiary-bg/90 dark:hover:bg-dark-tertiary-bg/90 rounded-md duration-100 dark:text-white w-full text-left px-3 py-2 flex items-center gap-5">
                <ChatIcon />
                  Chat
              </button>

              <span className='font-bold mt-4 text-2xl'>
                Sprints
              </span>

              <ul className='relative flex flex-col gap-3 box-border overflow-hidden overflow-y-scroll flex-1 mt-4 pr-4'>
                {sprints.map(sprint => (
                  <li className='group relative w-full dark:bg-dark-tertiary-bg hover:dark:bg-dark-tertiary-bg/60 bg-light-tertiary-bg dark:text-white text-black rounded-lg' key={sprint._id}>
                    <button
                      onClick={() => deleteSprintboard(sprint.name)}
                      className='aspect-square items-center justify-center text-red-600 absolute top-0 right-0 transition-all bg-tertiary-bg rounded-full hidden group-hover:flex hover:bg-light-secondary-bg size-6'
                    >
                      x
                    </button>
                    <button 
                      onClick={() => openSprintBoardEditor(sprint._id)}
                      className='items-center justify-center absolute top-1.5 right-5 translate-y-1/2 transition-all bg-tertiary-bg rounded-full hidden group-hover:flex hover:bg-light-secondary-bg'
                    >
                      <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    </button>
                    <button onClick={(e) => changeBoard(e)} className="w-full h-full text-left px-3 py-2 flex items-center gap-5" data-id={sprint._id}>
                      <span className='grid size-[45px] rounded-full bg-white'></span>
                        { sprint.name }
                    </button>
                  </li>
                ))}
                {
                  isCreatingSprintBoard && (
                    <li className='w-full dark:bg-dark-tertiary-bg bg-light-tertiary-bg dark:text-white text-black rounded-lg relative border-green-500 border-2'>
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
          <main id='main-dashboard' className='overflow-hidden gap-2 box-border transition-all rounded-lg'>
            <header className='dark:bg-dark-secondary-bg bg-light-secondary-bg rounded-lg flex items-center justify-between p-5'>
              <h1 
                ref={currentBoardTitleRef}
                title='Double click to edit the title.'
                className={`text-3xl font-bold dark:text-white text-black box-border dark:bg-dark-secondary-bg bg-light-secondary-bg rounded-lg`}
              >
                { latestSprint ? latestSprint.name : "Título mal."}
              </h1>

              <span className='flex items-center'>
                <button
                  id="share-butt"
                  className='bg-the-accent-color flex text-2xl mr-8 outline-none items-center justify-center rounded-md px-3 py-2 text-white font-medium hover:scale-105 transition-all gap-2'
                  onClick={() => setIsShareProjectModalOpen(true)}
                >
                  <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  <span>Compartir</span>
                </button>

                { /* TODO: Tooltip encima del +3 para mostrar todos los usuarios en linea. */ }
                {
                  otherUsers.length > 2 &&
                  (
                  <span className='size-8 mr-2 flex items-center justify-center bg-slate-400 rounded-full ml-'>
                    +3
                  </span>
                  )
                }

                <span className='flex pr-5'>
                  {
                    otherUsers.map((user, index) => {
                      console.log(otherUsers)
                      if (index < 2) return (
                      <span key={user._id} className='-mr-5 z-10 border-2 border-light-secondary-bg size-14 flex items-center justify-center bg-slate-400 rounded-full text-xl'>
                        { user.username[0].toUpperCase() }
                      </span>)
                    })
                  }
                </span>

                <div className='flex w-0.5 bg-black h-[56px] mx-3'></div>

                <button id='user-butt' onClick={() => setIsUserMenuOpen(true)} className='size-14 flex items-center justify-center bg-slate-400 rounded-full text-xl ml-'>
                  { thisUser ? thisUser.username[0].toUpperCase() : "" }
                </button>
              </span>
            </header>
            <section ref={ mainProjectContainerRef } id="main-project-container" className={`${section !== "TaskTable" && section !== "Chat" && "nice-gradient grid-cols-4"} ${section === 'Chat' && 'flex-col overflow-y-auto pb-[87px]'} dark:bg-dark-secondary-bg relative bg-light-secondary-bg rounded-lg overflow-hidden flex-row justify-between flex w-full max-h-screen content-between p-5`}> {/* grid */}
            {
                section === "SprintBoard" 
                  && <SprintBoard projectID={ projectID } latestSprint={ latestSprint } tasks={ tasks } webSocket={ ws } usersInProject={ usersInProject } />
              }
              {
                section === "TaskTable"
                  && <TaskTable project={ currProject } />
              }
              {
                section === "Chat"
                  && <Chat projectID={projectID} ws={ws} chat={chat} mainProjectContainerRef={mainProjectContainerRef} thisUser={ thisUser } otherUsers={ otherUsers } />
              }
            </section>
          </main>
        </section>
      ) }

      {
        isShareProjectModalOpen 
          && <ShareProjectModal project={ currProject } setIsShareProjectModalOpen={ setIsShareProjectModalOpen } isShareProjectModalOpen={ isShareProjectModalOpen } webSocket={ws}/>
      }
      {
        isEditSprintBoardOpen
          && <EditSprintBoardModal webSocket={ ws } projectID={ projectID } sprintIsGonnaBeEdited={ sprintIsGonnaBeEdited } setIsEditSprintBoardOpen={ setIsEditSprintBoardOpen } isEditSprintBoardOpen={ isEditSprintBoardOpen } latestSprint={latestSprint} setLatestSprint={setLatestSprint}/>
      }
      {
        isUserMenuOpen
          && <UserMenu theme={ theme } setTheme={ setTheme } setIsUserMenuOpen={ setIsUserMenuOpen } isUserMenuOpen={ isUserMenuOpen } />
      }
      <Toaster expand={ false } richColors position='bottom-right' />
    </>
  )
}

export default Project