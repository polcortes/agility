/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from 'react';

import TaskCard from '../project/TaskCard'
import CreateTaskModal from '../project/CreateTaskModal'
import EditTaskModal from './EditTaskModal';
// import { dragAndDrop } from '@formkit/drag-and-drop/react'

const SprintBoard = ({ projectID, latestSprint, tasks, webSocket, usersInProject }) => {
  const [ isCreateTaskOpen, setIsCreateTaskOpen ] = useState(false)

  const [ isEditTaskOpen, setIsEditTaskOpen ] = useState(false)

  const [ taskToEdit, setTaskToEdit ] = useState({})

  const [ organizedTasks, setOrganizedTasks ] = useState({})

  useEffect(() => {
    console.log(latestSprint)
    console.log("TASKS", tasks)
    const newOrganizedTasks = {
      todo: [],
      doing: [],
      testing: [],
      done: []
    }

    //modifiedTasks.forEach(task => newOrganizedTasks[task.status].push(task))

    tasks.forEach(task => {
      if (task.status === 'TO DO') newOrganizedTasks.todo.push(task)
      else if (task.status === 'DOING') newOrganizedTasks.doing.push(task)
      else if (task.status === 'TESTING') newOrganizedTasks.testing.push(task)
      else if (task.status === 'DONE') newOrganizedTasks.done.push(task)
    })

    console.log("NEWORG", newOrganizedTasks)

    setOrganizedTasks(newOrganizedTasks)
  }, [tasks, latestSprint])

  useEffect(() => {
    console.log("ORG", organizedTasks)
  }, [organizedTasks])

  const moveTask = (taskName, newStatus) => {
    webSocket.send(JSON.stringify({
      type: 'moveTask',
      projectID: projectID,
      sprintName: latestSprint.name,
      taskName: taskName,
      newStatus: newStatus
    }))
  }

  const openEditTaskModal = (taskName) => {
    console.log("OPEN")
    setIsEditTaskOpen(true)
    console.log(taskName)
    setTaskToEdit(tasks.find(task => task.name === taskName))
  }

  console.log("DOUBLECLICK BOARD", openEditTaskModal)



  useEffect(() => {
    // $('.kanban-column').sortable({
    //   containment: 'parent',
    //   handle: '.item-container',
    //   tolerance: 'pointer',
    //   helper: 'clone',
    // })
    $('.kanban-column').droppable({
      accept: '.task',
      appendTo: 'body',
      containment: 'window',
      helper: 'clone',
      drop: function(ev, ui) {
        console.log(tasks)
        console.log('dropable activado', this)
        console.log('El draggable que lo activó:', ui)
        console.log(projectID)
        console.log(latestSprint.name)
        //let newTasks = {tasks}
        //newTasks.filter(task => {return task.name === $(ui.draggable).find("p").text()})[0].status = $(this).find("h3").text().toUpperCase()
        let newOrganizedTasks = {...organizedTasks}
        let taskToMove = tasks.find(task => task.name === $(ui.draggable).find("p").text())
        let status = taskToMove.status.toLowerCase() === "to do" || taskToMove.status.toLowerCase() === "to-do" ? "todo" : taskToMove.status.toLowerCase()
        let newStatus = ($(this).find("h3").text().toLowerCase() === "to do" || $(this).find("h3").text().toLowerCase() === "to-do") ? "todo" : $(this).find("h3").text().toLowerCase()
        newOrganizedTasks[status].splice(newOrganizedTasks[status].findIndex(task => task === taskToMove), 1)
        taskToMove.status = newStatus.toUpperCase()
        newOrganizedTasks[newStatus].push(taskToMove)
        setOrganizedTasks(newOrganizedTasks)
        moveTask($(ui.draggable).find("p").text(), $(this).find("h3").text().toUpperCase() === "TO-DO" ? "TO DO" : $(this).find("h3").text().toUpperCase())
      }
    })
    /*
    $('.kanban-column').sortable({
      
    })
    */
  }, [latestSprint, tasks, organizedTasks])

  return (
    <>
      <div className='kanban-column flex flex-col align-center p-5 dark:text-white dark:bg-dark-secondary-bg bg-light-secondary-bg min-w-[340px] max-w-[430px] rounded-lg'>
        <h3 className='font-subtitle font-bold text-2xl mb-5'>To-do</h3>
        <ul className='flex flex-col rounded-lg overflow-hidden h-full pr-5 gap-5 flex-1 overflow-y-scroll max-h-[calc(100vh-320px)]'>
          { 
            organizedTasks.todo
              ? (organizedTasks.todo.map(task => <li key={task._id}><TaskCard text={task.name} onDoubleClickEvent={openEditTaskModal}/></li>))
              : 'hola'
          }
        </ul>
        <span className='flex justify-center border-t-2 border-black pt-4'>
          <button
            className='bg-the-accent-color flex items-center justify-center rounded-md px-3 py-2 text-white font-medium hover:scale-105 transition-all gap-2'
            onClick={() => setIsCreateTaskOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            Afegir tasca
          </button>
        </span>
      </div>

      <div className='kanban-column flex flex-col align-center p-5 dark:text-white dark:bg-dark-secondary-bg bg-light-secondary-bg min-w-[340px] max-w-[430px] rounded-lg'>
        <h3 className='font-subtitle font-bold text-2xl mb-5'>Doing</h3>
        <ul className='flex flex-col rounded-lg overflow-hidden h-full pr-5 gap-5 flex-1 overflow-y-scroll max-h-[calc(100vh-320px)]'>
          { 
            organizedTasks.doing
              ? (organizedTasks.doing.map(task => <li key={task._id}><TaskCard text={task.name} onDoubleClickEvent={openEditTaskModal}/></li>))
              : 'hola'
          }
        </ul>
      </div>

      <div className='kanban-column flex flex-col align-center p-5 dark:text-white dark:bg-dark-secondary-bg bg-light-secondary-bg min-w-[340px] max-w-[430px] rounded-lg'>
        <h3 className='font-subtitle font-bold text-2xl mb-5'>Testing</h3>
        <ul className='flex flex-col rounded-lg overflow-hidden h-full pr-5 gap-5 flex-1 overflow-y-scroll max-h-[calc(100vh-320px)]'>
          { 
            organizedTasks.testing
              ? (organizedTasks.testing.map(task => <li key={task._id}><TaskCard text={task.name} onDoubleClickEvent={openEditTaskModal}/></li>) )
              : 'hola'
          }
        </ul>
      </div>

      <div className='kanban-column flex flex-col align-center p-5 dark:text-white dark:bg-dark-secondary-bg bg-light-secondary-bg min-w-[340px] max-w-[430px] rounded-lg'>
        <h3 className='font-subtitle font-bold text-2xl mb-5'>Done</h3>
        <ul className='flex flex-col rounded-lg overflow-hidden h-full pr-5 gap-5 flex-1 overflow-y-scroll max-h-[calc(100vh-320px)]'>
          { 
            organizedTasks.done
              ? (organizedTasks.done.map(task => <li key={task._id}><TaskCard text={task.name} onDoubleClickEvent={openEditTaskModal}/></li>) )
              : 'hola'
          }
        </ul>
      </div>

      {
        isCreateTaskOpen
          && <CreateTaskModal projectID={ projectID } latestSprint={ latestSprint } isCreateTaskOpen={ isCreateTaskOpen } setIsCreateTaskOpen={ setIsCreateTaskOpen } webSocket={ webSocket } usersInProject={usersInProject}/>
      }

      {
        isEditTaskOpen
          && <EditTaskModal projectID={ projectID } latestSprint={ latestSprint } isEditTaskOpen={ isEditTaskOpen } setIsEditTaskOpen={ setIsEditTaskOpen } task={ taskToEdit } webSocket={ webSocket } usersInProject={ usersInProject } />
      }
    </>
  )
}

export default SprintBoard;