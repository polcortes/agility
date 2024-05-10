/* eslint-disable react/prop-types */
// import { useState } from 'react';
import { useEffect, useState } from 'react';
import TaskCard from '../project/TaskCard'

const TaskTable = ({ project }) => {
  
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    let newTasks = []
    Object.keys(project.sprints).forEach(sprintID => {
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
      <table>
        <thead className='border-b-2'>
            <tr>
                <th className="text-left">Tarea</th>
                <th className="text-left">Sprint</th>
                <th className="text-left">Miembro Asignado</th>
            </tr>
        </thead>
        <tbody>
            {tasks.map (task => (
                <tr key={task._id}>
                    <td>{task.name}</td>
                    <td>{task.sprintName}</td>
                    <td>{task.member}</td>
                </tr>
            ))}
        </tbody>
      </table>
    </>
  )
}

export default TaskTable;