/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'

const EditSprintBoardModal = ({ projectID, sprintIsGonnaBeEdited, setIsEditSprintBoardOpen, isEditSprintBoardOpen, webSocket, latestSprint, setLatestSprint, sprintsList }) => {
  const dialogRef = useRef()

  useEffect(() => {
    console.log("EDITSPRINT", latestSprint)
    console.log(sprintIsGonnaBeEdited.name)
    console.log(latestSprint.name === sprintIsGonnaBeEdited.name)
    if (isEditSprintBoardOpen) {
      dialogRef.current.showModal()
      dialogRef.current.style.opacity = 1
      document.documentElement.style.setProperty('--backdrop-bg', "rgba(0, 0, 0, .8)!important")
    } else {
      document.documentElement.style.setProperty('--backdrop-bg', "transparent")
      dialogRef.current.style.opacity = 0
      setTimeout(() => dialogRef.current.close(), 200)
    }
  }, [isEditSprintBoardOpen])

  useEffect(() => {
    console.log(webSocket)
  }, [webSocket])

  const sendEditSprintBoard = () => {
    if (sprintsList.includes(dialogRef.current.querySelector('input').value)) {
      toast.error('Aquest sprint ja existeix.', {
        duration: 3000,
        position: 'bottom-right',
        closeButton: true,
      })
    } else {
      if (latestSprint.name === sprintIsGonnaBeEdited.name) {
        let sprint =  {...latestSprint, name: dialogRef.current.querySelector('input').value}
        setLatestSprint(sprint)    
      }
      webSocket.send(JSON.stringify({
        type: 'editSprintBoard',
          projectID: projectID,
          oldName: sprintIsGonnaBeEdited.name,
          newName: dialogRef.current.querySelector('input').value
      }))
    }
    setIsEditSprintBoardOpen(false)
  }

  // TODO: En TODOS los "dialog" prevent default de pulsar la tecla de escape mientras estén activos.

  const manageEsc = (ev) => {
    if (ev.key === 'Escape') {
      ev.preventDefault()
      setIsEditSprintBoardOpen(false)
    }
  }

  // Llamada al back para editar.

  return (
    <dialog onKeyDown={ manageEsc } className="shadow-xl relative min-w-96 w-1/3 z-50 px-5 flex flex-col p-3 rounded-xl" ref={ dialogRef }>
        <button className='absolute top-3 right-3 hover:text-red-500 transition-none' onClick={() => setIsEditSprintBoardOpen(false)}>
          <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
        </button>
        <h2>Edit sprintboard</h2>
        <input className='my-5' type="text" name="" id="" defaultValue={ sprintIsGonnaBeEdited.name } placeholder={ sprintIsGonnaBeEdited.name } />
        <button className='bg-the-accent-color text-white p-2 rounded-full' onClick={ sendEditSprintBoard }>Edit</button>
        
    </dialog>
  )
}

export default EditSprintBoardModal