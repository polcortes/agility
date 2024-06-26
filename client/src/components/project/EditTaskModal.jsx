/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import CircleCheck from '../../assets/icons/circle-check'
import CircleX from '../../assets/icons/circle-x'

const EditTaskModal = ({ projectID, latestSprint, setIsEditTaskOpen, isEditTaskOpen, webSocket, task, usersInProject }) => {
  const dialogRef = useRef()
  const editTaskNameRef = useRef()
  const editTaskDescriptionRef = useRef()
  const editTaskAssignedUserRef = useRef()
  const editTaskStatusRef = useRef()
  const { t } = useTranslation()

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

  console.log(task)

  return (
    <dialog onClick={ handleOutsideClick } onKeyDown={ manageEsc } className="shadow-xl dark:shadow-the-accent-color relative z-50 flex flex-col overflow-hidden rounded-xl" ref={ dialogRef }>
      <div className='relative w-full h-full p-10'>
        <button title='[Esc] Tancar' className='absolute top-3 right-3 hover:text-red-500 transition-none' onClick={() => setIsEditTaskOpen(false)}>
          <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
        </button>

        <h2 className='font-title font-bold text-3xl mb-5'>{ t('project.editTaskTitle') }</h2>
        <label className='font-subtitle font-bold text-2xl w-full block' htmlFor='new-task-name'>{ t('project.addTaskTitleLabel') }</label>
        <input ref={ editTaskNameRef } defaultValue={task.name} className='w-full p-1 font-body font-medium text-lg border-2 border-dark-primary-bg rounded-md outline-none' type="text" name="new-task-name" id="new-task-name" />

        <label className='flex gap-3 items-center font-subtitle font-bold text-2xl mt-3' htmlFor='new-task-description'>{ t('project.addTaskDescriptionLabel') }</label>
        <textarea ref={ editTaskDescriptionRef } defaultValue={task.description} className='p-1 font-body font-medium text-lg border-2 border-dark-primary-bg rounded-md outline-none' name="new-task-description" id="new-task-description" cols="30" rows="10"></textarea>

        <label className='flex gap-3 items-center font-subtitle font-bold text-2xl mt-3' htmlFor='assigned-user'>{ t('project.addTaskAssignedToLabel') }</label>
        <select ref={ editTaskAssignedUserRef } className='font-body font-medium text-lg border-2 border-dark-primary-bg rounded-md outline-none p-1 w-full'>
          <option></option>
          {
            usersInProject.map(user => (
              user == task.assignedMember 
                ? <option key={user} selected>{user}</option> 
                : <option key={user} >{user}</option>
          ))
          }
        </select>

        <label className='flex gap-3 items-center font-subtitle font-bold text-2xl mt-3' htmlFor='assigned-user'>{ t('project.addTaskStateLabel') }</label>
        <select ref={ editTaskStatusRef } className='font-body font-medium text-lg border-2 border-dark-primary-bg rounded-md outline-none p-1 w-full'>
          { task.status == "TO DO"
            ? <option value="TO DO" selected>To-Do</option>
            : <option value="TO DO">To-Do</option>
          }
          { task.status == "DOING"
            ? <option value="DOING" selected>Doing</option>
            : <option value="DOING">Doing</option>}
          { task.status == "TESTING"
            ? <option value="TESTING" selected>Testing</option>
            : <option value="TESTING">Testing</option>}
          { task.status == "DONE"
            ? <option value="DONE" selected>Done</option>
            : <option value="DONE">Done</option>}
        </select>

        <div className='flex mx-auto justify-around mt-5'>
          <button onClick={() => editTask()} className='bg-the-accent-color text-white p-2 rounded-full flex gap-1'> 
            <CircleCheck className="text-green-500"></CircleCheck>
            { t('project.editTaskSaveBtn') }
          </button>

          <button onClick={() => deleteTask()} className='bg-the-accent-color text-white p-2 rounded-full flex gap-1'> 
            <CircleX className="text-red-500"></CircleX>
            { t('project.editTaskDeleteBtn') }
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default EditTaskModal