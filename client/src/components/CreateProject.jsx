/* eslint-disable react/prop-types */
import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next';

const CreateProject = ({ onClose }) => {
  const [isOutsideClicked, setIsOutsideClicked] = useState(false);
  const [isCreateErrorShown, setIsCreateErrorShown] = useState(false);
  const projectTitleRef = useRef(null)
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("#create-project-container") && !event.target.closest("#create-project-button")) {
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

  const handleCreateProject = () => {
    axios
      .post(`${import.meta.env.VITE_API_ROUTE}/createProject`, {
        token: localStorage.getItem("userToken"),
        title: projectTitleRef.current.value,
        description: '',
      })
      .then(res => {
        res = res.data
        console.log(res.result)
        if (res.status === "OK") {
          window.location.href = `/project/${res.projectID}`
        } else if (res.result === "TOKEN EXPIRED") {
          window.location.href = '/'
        }
      })
  }

  function insertNewProject(title) {
    if (title === '' || title === null) {
      setIsCreateErrorShown(true);
      return
    }
    setIsCreateErrorShown(false)
    handleCreateProject()
  }

  return (
    <div id="create-project-container" className="absolute top-28 bg-light-secondary-bg dark:bg-dark-secondary-bg left-1/2 -translate-x-1/2 p-10 flex flex-col border-2 border-black rounded-lg">
      <label 
        htmlFor="create-project-name"
        className="text-black dark:text-white mb-1"
      >
        { t('dashboard.createProjectBtn') }
      </label>

      <input 
        ref={projectTitleRef}
        className="w-full p-2 border-2 text-black dark:text-white border-black dark:border-white rounded-md bg-transparent outline-none"
        type="text" 
        name="create-project-name" 
        id="create-project-name" 
        placeholder={ t('dashboard.createProjectTitlePlaceholder') } 
      />

      <button
        onClick={() => insertNewProject(projectTitleRef.current.value)}
        className="bg-the-accent-color flex items-center justify-center rounded-md px-3 py-2 text-white font-medium hover:scale-105 transition-all gap-2 w-fit mx-auto mt-5"
      >
        <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
        { t('dashboard.createProjectCreateBtn') }
      </button>
      <p className={`text-red-600 font-bold text-center mt-4 ${isCreateErrorShown ? 'block' : 'hidden'}`}>{ t('dashboard.createProjectError') }</p>
    </div>
  )
}

export default CreateProject