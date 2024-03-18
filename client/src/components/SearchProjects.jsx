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
    <div id="search-projects-container" className="absolute top-28 bg-white right-32 p-5 flex flex-col border-2 border-black rounded-lg max-h-96 dark:bg-dark-primary-bg">
      <h2
        className='font-subtitle text-2xl mb-5 '
      >
        Resultats de la cerca:
      </h2>

      <ul className='pr-2 overflow-y-scroll'>
      { projects 
          && projects.length !== 0 
          && projects[0] !== "No s'han trobat resultats"
          && projects.map((project, index) => (
          <li key={index} className="mb-2 w-full hover:bg-light-tertiary-bg p-2 rounded-md">
              <a href={`/projects?id=${project._id}`} className='w-full'>
                  <h3 className="font-title text-xl">{project.title}</h3>
                  <p className="font-body text-lg">{project.author}</p>
              </a>
          </li>
          ))
      }

      { projects[0] === "No s'han trobat resultats" 
        && <li className="mb-2 w-full hover:bg-light-tertiary-bg p-2 rounded-md">
            <h3 className="font-title text-xl">{projects[0]}</h3>
        </li>
        
      }
      </ul>
      
    </div>
  );
};

export default SearchProjects;
