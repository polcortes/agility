import DarkIcon from '../assets/icons/dark-agility'

const Home = () => {
  return (
    <main 
      className="min-h-screen w-screen box-border p-4 bg-[#100C12] text-white grid grid-cols-[4fr_2fr] gap-4"
    >
      <section className="bg-[#251B28]/80 px-6 py-14 rounded-md flex flex-col items-center justify-center">
        <DarkIcon className="w-8 h-8" />
        <div className="text-2xl mt-5">Gestiona tus proyectos de Scrum</div>
        <div className='text-2xl underline decoration-indigo-600'>más rápido que nunca</div>
      </section>
      <aside className="bg-[#251B28]/80 px-6 py-14 rounded-md flex flex-col items-center justify-center">
        <h1 className='text-3xl font-bold'>Log in or sign up!</h1>
        <button className='bg-white py-2 px-4 mt-6 text-black font-semibold cursor-pointer rounded-full hover:bg-slate-100/70 transition-colors'>
          Google
        </button>
      </aside>
    </main>
  );
}

export default Home;