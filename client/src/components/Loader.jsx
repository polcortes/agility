import LightAgilityNoText from "../assets/icons/light-agility-no-text";

const Loader = () => {
    return (
        <div className="loader absolute w-screen h-screen bg-light-primary-bg z-50 flex items-center justify-center">
            <LightAgilityNoText />
        </div>
    );
}

export default Loader;