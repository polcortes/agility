import Sun from '../assets/icons/sun'
import Moon from '../assets/icons/moon'

const ThemeToggler = props => {
	return (
		<div className="absolute top-6 left-6 flex gap-4">
			<input type="checkbox" id="theme-toggler" className="hidden" onClick={props.onClick}/>
			<label htmlFor="theme-toggler" className={`
			flex items-center flex justify-between align-center 
			border-solid border-2 border-black dark:border-white 
			rounded-full w-20 cursor-pointer overflow-hidden
			bg-gradient-to-r from-50% to-50% transition-colors
			${props.className}`}>
				<Sun className="w-1/2 h-full p-1" />
				<Moon className="w-1/2 h-full dark:text-black p-1" />
			</label>
		</div>
	)
}

export default ThemeToggler 