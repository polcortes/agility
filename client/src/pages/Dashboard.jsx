// import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

// import DarkIcon from '../assets/icons/dark-agility'
import LightIcon from '../assets/icons/light-agility'


const Dashboard = () => {
  const projects = [
    {
      title: 'Projecte 1',
      author: 'Erik Tamaño',
      href: '/projecte-1'
    },
    {
      title: 'Projecte 2',
      author: 'Pol Cortés',
      href: '/projecte-2'
    },
    {
      title: 'Projecte 3',
      author: 'Erik Tamaño',
      href: '/projecte-3'
    },
    {
      title: 'Projecte 4',
      author: 'Erik Tamaño',
      href: '/projecte-4'
    },
    {
      title: 'Projecte 5',
      author: 'Pol Cortés',
      href: '/projecte-5'
    },
    {
      title: 'Projecte 6',
      author: 'Erik Tamaño',
      href: '/projecte-6'
    },
    {
      title: 'Projecte 1',
      author: 'Erik Tamaño',
      href: '/projecte-1'
    },
    {
      title: 'Projecte 2',
      author: 'Pol Cortés',
      href: '/projecte-2'
    },
    {
      title: 'Projecte 3',
      author: 'Erik Tamaño',
      href: '/projecte-3'
    },
    {
      title: 'Projecte 4',
      author: 'Erik Tamaño',
      href: '/projecte-4'
    },
    {
      title: 'Projecte 5',
      author: 'Pol Cortés',
      href: '/projecte-5'
    },
    {
      title: 'Projecte 6',
      author: 'Erik Tamaño',
      href: '/projecte-6'
    },
    {
      title: 'Projecte 1',
      author: 'Erik Tamaño',
      href: '/projecte-1'
    },
    {
      title: 'Projecte 2',
      author: 'Pol Cortés',
      href: '/projecte-2'
    },
    {
      title: 'Projecte 3',
      author: 'Erik Tamaño',
      href: '/projecte-3'
    },
    {
      title: 'Projecte 4',
      author: 'Erik Tamaño',
      href: '/projecte-4'
    },
    {
      title: 'Projecte 5',
      author: 'Pol Cortés',
      href: '/projecte-5'
    },
    {
      title: 'Projecte 6',
      author: 'Erik Tamaño',
      href: '/projecte-6'
    },
    {
      title: 'Projecte 1',
      author: 'Erik Tamaño',
      href: '/projecte-1'
    },
    {
      title: 'Projecte 2',
      author: 'Pol Cortés',
      href: '/projecte-2'
    },
    {
      title: 'Projecte 3',
      author: 'Erik Tamaño',
      href: '/projecte-3'
    },
    {
      title: 'Projecte 4',
      author: 'Erik Tamaño',
      href: '/projecte-4'
    },
    {
      title: 'Projecte 5',
      author: 'Pol Cortés',
      href: '/projecte-5'
    },
    {
      title: 'Projecte 6',
      author: 'Erik Tamaño',
      href: '/projecte-6'
    },
    {
      title: 'Projecte 1',
      author: 'Erik Tamaño',
      href: '/projecte-1'
    },
    {
      title: 'Projecte 2',
      author: 'Pol Cortés',
      href: '/projecte-2'
    },
    {
      title: 'Projecte 3',
      author: 'Erik Tamaño',
      href: '/projecte-3'
    },
    {
      title: 'Projecte 4',
      author: 'Erik Tamaño',
      href: '/projecte-4'
    },
    {
      title: 'Projecte 5',
      author: 'Pol Cortés',
      href: '/projecte-5'
    },
    {
      title: 'Projecte 6',
      author: 'Erik Tamaño',
      href: '/projecte-6'
    },
    {
      title: 'Projecte 1',
      author: 'Erik Tamaño',
      href: '/projecte-1'
    },
    {
      title: 'Projecte 2',
      author: 'Pol Cortés',
      href: '/projecte-2'
    },
    {
      title: 'Projecte 3',
      author: 'Erik Tamaño',
      href: '/projecte-3'
    },
    {
      title: 'Projecte 4',
      author: 'Erik Tamaño',
      href: '/projecte-4'
    },
    {
      title: 'Projecte 5',
      author: 'Pol Cortés',
      href: '/projecte-5'
    },
    {
      title: 'Projecte 6',
      author: 'Erik Tamaño',
      href: '/projecte-6'
    },
    
  ]

  return (
    <>
      <Helmet>
        <title>Els teus projectes | Agility</title>
        <meta name="description" content="Projectes" />
      </Helmet>

      <main 
        className="
          grid grid-rows-[82px_1fr] overflow-hidden gap-4
          w-screen h-screen xl:p-4 box-border font-body transition-[padding]
          bg-gradient-to-t from-indigo-50/80 to-indigo-50"
      >
        <header 
          className='
            p-5 rounded-md 
            flex items-center justify-between
            bg-white'
        >
          <LightIcon className={`w-64 h-auto`} />
        </header>
        <section 
          className="
            p-5 rounded-md overflow-y-scroll
            flex flex-col items-center
            bg-white"
        >
          <h1 className="font-title font-extrabold text-[] text-5xl mb-6">Projectes</h1>
          <section className='grid lg:grid-cols-3 gap-8 w-full md:px-24 px-6 sm:grid-cols-2 grid-cols-1'>
            {projects.map((project, index) => {
              return (
                <article key={index} className="rounded-md shadow-lg">
                  <a href={project.href} className='h-full w-full bg-indigo-50 hover:bg-indigo-100 grid grid-cols-[1fr_3fr] grid-rows-2 p-3 rounded-md'>
                    <span className="size-16 mr-5 bg-black row-span-2 rounded-md"></span>
                    <h2 className="font-medium text-xl flex items-center">{project.title}</h2>
                    <span className="flex items-center">De: {project.author}</span>
                  </a>
                </article>
              )
            })}
          </section>
        </section>
      </main>
    </>
  )
}

export default Dashboard