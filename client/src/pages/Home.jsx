import DarkIcon from '../assets/icons/dark-agility'
import { useTranslation } from 'react-i18next'
import LanguageChanger from '../components/LanguageChanger'

const Home = () => {
  const { t } = useTranslation()

  return (
    <main 
      className="min-h-screen w-screen box-border p-4 bg-[#100C12] text-white grid grid-cols-[4fr_2fr] gap-4"
    >
      <section className="bg-[#251B28]/80 px-6 py-14 rounded-md flex flex-col items-center justify-center">
        <DarkIcon className="w-8 h-8" />
        <div className="text-2xl mt-5">{ t("home.description1") }</div>
        <div className='text-2xl underline decoration-indigo-600'>{ t("home.description2") }</div>
      </section>
      <aside className="relative bg-[#251B28]/80 px-6 py-14 rounded-md flex flex-col items-center justify-center">
        <LanguageChanger props={true} />
        
        <h1 className='text-3xl font-bold'>{ t("home.accessAccount") }</h1>
        <button className='bg-white py-2 px-4 mt-6 text-black font-semibold cursor-pointer rounded-full hover:bg-slate-100/70 transition-colors'>
          Google
        </button>
      </aside>
    </main>
  );
}

export default Home;