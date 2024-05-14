/* eslint-disable react/prop-types */
// import { useState } from 'react';
import { useEffect, useState } from 'react';
import TaskCard from '../project/TaskCard'

const TaskTable = ({ project }) => {
  
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    let newTasks = []
    Object.keys(project.sprints).forEach(sprintID => {
      if (!project.sprints[sprintID].tasks) project.sprints[sprintID].tasks = {}
      Object.keys(project.sprints[sprintID].tasks).forEach(taskID => {
        newTasks.push(project.sprints[sprintID].tasks[taskID])
        newTasks[newTasks.length - 1].sprintName = sprintID
      })
    })
    setTasks(newTasks)
  }, [project])

  useEffect(() => {
    console.log(tasks)
  }, [tasks])


  return (
    <>
      <div className='w-full'>
        <table className='w-full'>
          <thead className='border-b-2'>
              <tr>
                  <th className="text-left text-black dark:text-white text-xl py-1 px-3">Tarea</th>
                  <th className="text-left text-black dark:text-white text-xl py-1 px-3">Sprint</th>
                  <th className='text-left text-black dark:text-white text-xl py-1 px-3'>Estado</th>
                  <th className="text-left text-black dark:text-white text-xl py-1 px-3">Miembro Asignado</th>
              </tr>
          </thead>
          <tbody>
              {tasks?.map((task, index) => (
                  <tr key={task._id} className={index % 2 == 0 ? 'bg-light-primary-bg dark:bg-dark-tertiary-bg' : 'bg-light-secondary-bg dark:bg-dark-tertiary-bg/40'}>
                      <td className='text-black dark:text-white text-lg py-1 px-3'>{task.name}</td>
                      <td className='text-black dark:text-white text-lg py-1 px-3'>{task.sprintName}</td>
                      <td className='text-black dark:text-white text-lg py-1 px-3'>{task.status}</td>
                      <td className='text-black dark:text-white text-lg py-1 px-3'>{task.assignedMember || ''}</td>
                  </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default TaskTable;