/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'

const UserProfilePhoto = ({ username }) => {
  const photoRef = useRef(null)

  // const checkIsntThereAPhoto = (photo) => {
  //   return photo.length > 0;
  // }

  useEffect(() => {
    photoRef.current.style.backgroundImage = '';
    photoRef.current.innerText = username.charAt(0);
    photoRef.current.style.userSelect = 'none'
  }, [])

  return (
    <>
      <div ref={ photoRef } className="size-8 rounded-full grid place-content-center border-2 border-black dark:text-white">
        
      </div>
    </>
  )
}

export default UserProfilePhoto;