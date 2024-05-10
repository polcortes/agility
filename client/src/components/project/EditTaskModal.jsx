/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'
import axios from 'axios'

const EditTaskModal = ({ projectID, latestSprint, setIsEditTaskOpen, isEditTaskOpen, webSocket, task, usersInProject }) => {
  const dialogRef = useRef()
  const editTaskNameRef = useRef()
  const editTaskDescriptionRef = useRef()
  const editTaskAssignedUserRef = useRef()
  const editTaskStatusRef = useRef()

  useEffect(() => {
    if (isEditTaskOpen) {
      dialogRef.current.showModal()
      dialogRef.current.style.opacity = 1
      document.documentElement.style.setProperty('--backdrop-bg', "rgba(0, 0, 0, .5)")
    } else {
      document.documentElement.style.setProperty('--backdrop-bg', "transparent")
      dialogRef.current.style.opacity = 0
      setTimeout(() => dialogRef.current.close(), 200)
    }
  }, [isEditTaskOpen])

  const editTask = () => {
    console.log("EDIT")
    console.log(editTaskAssignedUserRef.current.value)
    webSocket.send(JSON.stringify({
      type: 'editTask',
      projectID: projectID,
      sprintName: latestSprint.name,
      taskID: task.id,
      oldName: task.name,
      newName: editTaskNameRef.current.value,
      description: editTaskDescriptionRef.current.value,
      assignedMember: editTaskAssignedUserRef.current.value,
      status: editTaskStatusRef.current.value,
    }))
    setIsEditTaskOpen(false)
    /*
    webSocket.send(JSON.stringify({
      type: 'createTask',
      projectID: projectID,
      sprintName: latestSprint.name,
      taskName: newTaskNameRef.current.value,
    }))
    setIsEditTaskOpen(false)
    /*
    axios
      .post(`http://localhost:3000/createTask/`, {
        token: localStorage.getItem("userToken"),
        projectID: projectID,
        sprintName: latestSprint.name,
        name: newTaskNameRef.current.value,
      })
      .then(res => {
        res = res.data
        if (res.status === 'OK') console.log('Task created')
        else console.error('Error creating task')
      })
      */
  }

  const deleteTask = () => {
    webSocket.send(JSON.stringify({
      type: 'deleteTask',
      projectID: projectID,
      sprintName: latestSprint.name,
      taskName: task.name,
    }))
    setIsEditTaskOpen(false)
  }

  const manageEsc = (ev) => {
    if (ev.key === 'Escape') {
      ev.preventDefault()
      setIsEditTaskOpen(false)
    }
  }

  const handleOutsideClick = (ev) => {
    if (ev.target === dialogRef.current) {
      setIsEditTaskOpen(false)
    }
  }

  return (
    <dialog onClick={ handleOutsideClick } onKeyDown={ manageEsc } className="shadow-xl dark:shadow-the-accent-color relative z-50 flex flex-col overflow-hidden rounded-xl" ref={ dialogRef }>
      <div className='relative w-full h-full p-10'>
        <button title='[Esc] Tancar' className='absolute top-3 right-3 hover:text-red-500 transition-none' onClick={() => setIsEditTaskOpen(false)}>
          <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
        </button>

        <h2 className='font-title font-bold text-3xl mb-5'>Editar tasca</h2>
        <label className='font-subtitle font-bold text-2xl' htmlFor='new-task-name'>Títol</label>
        <input ref={ editTaskNameRef } className=' font-body font-medium text-lg border-2 border-dark-primary-bg rounded-md outline-none' type="text" name="new-task-name" id="new-task-name" />

        <label className='flex gap-3 items-center font-subtitle font-bold text-2xl mt-3' htmlFor='new-task-description'>Descripció <svg className='hover:cursor-help' width="18" height="18" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M1.34473 11.4997C1.34473 5.89129 5.89128 1.34473 11.4997 1.34473C17.1082 1.34473 21.6547 5.89129 21.6547 11.4997C21.6547 17.1082 17.1082 21.6548 11.4997 21.6548C5.89128 21.6548 1.34473 17.1082 1.34473 11.4997ZM11.4997 2.80139C6.69578 2.80139 2.8014 6.69578 2.8014 11.4997C2.8014 16.3036 6.69578 20.1981 11.4997 20.1981C16.3037 20.1981 20.198 16.3036 20.198 11.4997C20.198 6.69578 16.3037 2.80139 11.4997 2.80139ZM12.6498 16.1002C12.6498 16.7353 12.1349 17.2502 11.4998 17.2502C10.8646 17.2502 10.3498 16.7353 10.3498 16.1002C10.3498 15.4651 10.8646 14.9502 11.4998 14.9502C12.1349 14.9502 12.6498 15.4651 12.6498 16.1002ZM9.27659 9.58349C9.27659 8.54406 10.1737 7.55183 11.4999 7.55183C12.8261 7.55183 13.7233 8.54406 13.7233 9.58349C13.7233 10.3366 13.3092 10.7214 12.5954 11.1551C12.5157 11.2035 12.4238 11.2568 12.3255 11.3139C12.0446 11.4771 11.7113 11.6707 11.4608 11.8658C11.0892 12.1554 10.6566 12.6225 10.6566 13.3402C10.6566 13.8059 11.0342 14.1835 11.4999 14.1835C11.9636 14.1835 12.3398 13.8094 12.3432 13.3466L12.3441 13.3452C12.3574 13.3242 12.3968 13.2748 12.4974 13.1963C12.6531 13.0751 12.8263 12.9747 13.0572 12.8408C13.1776 12.7711 13.3138 12.6922 13.4711 12.5966C14.2906 12.0987 15.4099 11.276 15.4099 9.58349C15.4099 7.55626 13.7004 5.86516 11.4999 5.86516C9.29948 5.86516 7.58992 7.55626 7.58992 9.58349C7.58992 10.0493 7.96751 10.4268 8.43326 10.4268C8.89902 10.4268 9.27659 10.0493 9.27659 9.58349Z" fill="black"/></svg></label>
        <textarea ref={ editTaskDescriptionRef } className=' font-body font-medium text-lg border-2 border-dark-primary-bg rounded-md outline-none' name="new-task-description" id="new-task-description" cols="30" rows="10"></textarea>

        <label className='flex gap-3 items-center font-subtitle font-bold text-2xl mt-3' htmlFor='assigned-user'>Usuari Assignat</label>
        <select ref={ editTaskAssignedUserRef } className='font-body font-medium text-lg border-2 border-dark-primary-bg rounded-md outline-none'>
          <option></option>
          {
            usersInProject.map(user => <option key={user}>{user}</option>)
          }
        </select>

        <label className='flex gap-3 items-center font-subtitle font-bold text-2xl mt-3' htmlFor='assigned-user'>Estat</label>
        <select ref={ editTaskStatusRef } className='font-body font-medium text-lg border-2 border-dark-primary-bg rounded-md outline-none'>
          <option value="TO DO">To-Do</option>
          <option value="DOING">Doing</option>
          <option value="TEST">Testing</option>
          <option value="DONE">Done</option>
        </select>

        <div className='flex mx-auto'>
          <button onClick={() => editTask()}>
            Desar dades
          </button>

          <button onClick={() => deleteTask()}> 
            Eliminar tasca
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default EditTaskModal