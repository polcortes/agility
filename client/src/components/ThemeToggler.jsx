/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import Sun from '../assets/icons/sun'
import Moon from '../assets/icons/moon'
// import { subscribe, unsubscribe, publish } from '../customEvents/event'

const ThemeToggler = ({theme, setTheme}) => {
	// const [theme, setTheme] = useState('dark')

	const [path, setPath] = useState('')
	useEffect(() => {
		if (window.location.pathname === '/') {
			setPath('/')
		} else {
			setPath('else')
		}
	}, [window.location.pathname])

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
		document.documentElement.classList.toggle('dark');
		if (window.localStorage.getItem('theme') === 'dark') window.localStorage.setItem('theme', 'light')
		else window.localStorage.setItem('theme', 'dark')
	}

	return (
		<div className={`${path === '/' ? 'absolute top-6 left-6' : 'mt-2 mx-[25%]'} flex gap-4 `}>
			<input type="checkbox" id="theme-toggler" className="hidden" onClick={() => toggleTheme()}/>
			<label htmlFor="theme-toggler" className={`
			flex items-center justify-between align-center 
			border-solid dark:text-white border-2 border-black dark:border-white 
			rounded-full w-20 cursor-pointer overflow-hidden
			bg-gradient-to-r from-50% to-50% transition-colors
			${theme === 'dark' ? "from-transparent to-white" : "from-the-accent-color"}`}>
				<Sun className="w-1/2 h-full p-1" />
				<Moon className="w-1/2 h-full dark:text-black p-1" />
			</label>
		</div>
	)
}

export default ThemeToggler 