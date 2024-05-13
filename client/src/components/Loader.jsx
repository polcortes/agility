import LightAgilityNoText from "../assets/icons/light-agility-no-text";
import DarkAgilityNoText from "../assets/icons/dark-agility-no-text";

const Loader = ({theme}) => {
    return (
        <div className="loader absolute w-screen h-screen bg-light-primary-bg z-50 flex items-center justify-center dark:bg-dark-secondary-bg">
            {
                theme === "dark" ? 
                <DarkAgilityNoText /> : <LightAgilityNoText />
            }
        </div>
    );
}

export default Loader;