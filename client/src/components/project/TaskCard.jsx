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
          <article className="flex bg-light-tertiary-bg py-3 px-4 rounded-2xl items-center task">
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
    <article className="flex bg-light-tertiary-bg py-3 px-4 rounded-2xl items-center task">
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

      {
        type == "doing"
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