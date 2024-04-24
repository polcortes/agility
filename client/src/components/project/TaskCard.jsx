/* eslint-disable react/prop-types */
import { useEffect } from 'react'

const TaskCard = ({ text, onDoubleClick, type }) => {
  // type = "doing"

  useEffect(() => {
    // TODO: El sortable, el droppable es por back.
    $('.task').draggable({ 
      handle: '.draggable-section',
      cancel: 'invalid',
      helper: function() {
        return $(`
          <article className="flex bg-light-tertiary-bg dark:bg-dark-tertiary-bg py-3 px-4 rounded-2xl items-center task">
            <span 
              className="
                draggable-section
                grid grid-cols-2 grid-rows-3 gap-1 
                w-fit hover:cursor-grab mr-3 p-1"
            >
              <span className="bg-dark-primary-bg dark:bg-light-primary-bg rounded-full w-[3px] h-[3px]"></span>
              <span className="bg-dark-primary-bg dark:bg-light-primary-bg rounded-full w-[3px] h-[3px]"></span>
              <span className="bg-dark-primary-bg dark:bg-light-primary-bg rounded-full w-[3px] h-[3px]"></span>
              <span className="bg-dark-primary-bg dark:bg-light-primary-bg rounded-full w-[3px] h-[3px]"></span>
              <span className="bg-dark-primary-bg dark:bg-light-primary-bg rounded-full w-[3px] h-[3px]"></span>
              <span className="bg-dark-primary-bg dark:bg-light-primary-bg rounded-full w-[3px] h-[3px]"></span>
              <span className="bg-dark-primary-bg dark:bg-light-primary-bg rounded-full w-[3px] h-[3px]"></span>
              <span className="bg-dark-primary-bg dark:bg-light-primary-bg rounded-full w-[3px] h-[3px]"></span>
            </span>

            <p className="w-full">
              ${ $(this).find('p').text() }
            </p>
          </article>
        `)
      },
      cursor: 'grabbing',
      start: function() {
        $('.task > span.draggable-section').css({ cursor: 'grabbing', }).toggleClass('bg-light-tertiary-bg').toggleClass('bg-light-tertiary-bg/40')
      },
      stop: () => $('.task > span.draggable-section').css('cursor', 'grab'),
    })
  }, [])
  
  return (
    <article className="group relative flex dark:bg-dark-tertiary-bg bg-light-tertiary-bg py-3 px-4 rounded-2xl items-center task">
      <span 
        className="
          draggable-section
          grid grid-cols-2 grid-rows-3 gap-1 
          w-fit hover:cursor-grab mr-3 p-1"
      >
        <span className="bg-dark-primary-bg dark:bg-light-primary-bg rounded-full w-[3px] h-[3px]"></span>
        <span className="bg-dark-primary-bg dark:bg-light-primary-bg rounded-full w-[3px] h-[3px]"></span>
        <span className="bg-dark-primary-bg dark:bg-light-primary-bg rounded-full w-[3px] h-[3px]"></span>
        <span className="bg-dark-primary-bg dark:bg-light-primary-bg rounded-full w-[3px] h-[3px]"></span>
        <span className="bg-dark-primary-bg dark:bg-light-primary-bg rounded-full w-[3px] h-[3px]"></span>
        <span className="bg-dark-primary-bg dark:bg-light-primary-bg rounded-full w-[3px] h-[3px]"></span>
        <span className="bg-dark-primary-bg dark:bg-light-primary-bg rounded-full w-[3px] h-[3px]"></span>
        <span className="bg-dark-primary-bg dark:bg-light-primary-bg rounded-full w-[3px] h-[3px]"></span>
      </span>

      <p onDoubleClick={ onDoubleClick } className="w-full">
        { text }
      </p>

      <button 
        onClick={ onDoubleClick }
        className='items-center justify-center absolute -top-1.5 right-3 translate-y-1/2 transition-all bg-tertiary-bg rounded-full hidden group-hover:flex hover:bg-light-secondary-bg dark:hover:bg-dark-secondary-bg'
      >
        <svg width="35" height="35" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
      </button>

      {
        type === "doing"
          && (
            <span className="users-doing">
              <span className="user flex w-12 h-12 rounded-full border-white border-2 bg-black"></span>
            </span>
          )
      }
    </article>
  )
}

export default TaskCard;