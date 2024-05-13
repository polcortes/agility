/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const SearchProjects = ({ onClose, projects }) => {
  const [isOutsideClicked, setIsOutsideClicked] = useState(false);
//   const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("#search-projects-container") && !event.target.closest("#search-in-projects")) {
        setIsOutsideClicked(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOutsideClicked) {
      onClose();
    }
  }, [isOutsideClicked, onClose]);

  return (
    <div 
      id="search-projects-container" 
      className="
        absolute top-40 left-1/2 -translate-x-1/2 md:left-[initial] md:-translate-x-0 md:top-28 md:right-32 
        max-w-64 p-5 bg-white flex flex-col border-2 border-black rounded-lg max-h-96 dark:bg-dark-secondary-bg
      "
    >
      <h2
        className='font-subtitle text-2xl mb-5 text-black dark:text-white'
      >
        Resultats de la cerca:
      </h2>

      <ul className='pr-2 overflow-y-scroll'>
      { projects 
          && projects.length !== 0 
          && projects[0] !== "No s'han trobat resultats"
          && projects.map((project, index) => (
          <li key={index} className="mb-2 w-full text-black dark:text-white hover:bg-light-tertiary-bg dark:hover:bg-dark-tertiary-bg rounded-md">
              <a href={`/project/${project._id}`} className='w-full h-full underline decoration-the-accent-color'>
                  <h3 className="font-title text-xl p-2">{project.title}</h3>
              </a>
          </li>
          ))
      }

      { projects[0] === "No s'han trobat resultats" 
        && <li className="dark:text-white mb-2 w-full hover:bg-light-tertiary-bg p-2 rounded-md">
            <h3 className="font-title text-xl">{projects[0]}</h3>
        </li>
        
      }
      </ul>
      
    </div>
  );
};

export default SearchProjects;
