/* eslint-disable react/prop-types */
import { useTranslation } from 'react-i18next'

const ProjectCard = ({ project }) => {
  const { t } = useTranslation()

  return (
    <article className="rounded-md shadow-xl hover:scale-105 transition-all hover:shadow-the-accent-color/30 overflow-hidden">
      <a href={`/project/${project._id}`} className='h-full w-full bg-light-secondary-bg dark:bg-dark-secondary-bg grid grid-cols-[1fr_3fr] grid-rows-2 p-3 rounded-md overflow-hidden'>
        <span className="size-16 mr-5 bg-black row-span-2 rounded-md"></span>
        <h2 className="font-medium text-black dark:text-white text-xl flex items-center line-clamp-1">{project.title}</h2>
        <span className="flex text-black dark:text-white/80 items-center line-clamp-1">{t('dashboard.projectOwner') + project.creator}</span>
      </a>
    </article>
  )
}

export default ProjectCard