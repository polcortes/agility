/* eslint-disable react/prop-types */
// import { useState } from 'react';
import TaskCard from '../project/TaskCard'

const TaskTable = ({ tasks }) => {

  const createTask = () => {
    
  }

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
                <tr key={task.key}>
                    <td>{task.text}</td>
                    <td>{task.sprint}</td>
                    <td>{task.member}</td>
                </tr>
            ))}
        </tbody>
      </table>
    </>
  )
}

export default TaskTable;