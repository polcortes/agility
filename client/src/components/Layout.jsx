import { Outlet, Link/*, useLocation*/ } from 'react-router-dom';
import LanguageChanger from './LanguageChanger';

const Layout = () => {
  // const location = useLocation();

  // Verificar si la ubicación actual es diferente a la raíz ("/")
  // const shouldShowNav = location.pathname !== "/";
  const shouldShowNav = false;

  return (
    <>
      {shouldShowNav && (
        <nav className='w-screen bg-slate-900 text-white'>
          <ul>
            <li>
              <Link to="./">Home</Link>
            </li>
          </ul>

          <LanguageChanger />
        </nav>
      )}

      <Outlet />
    </>
  );
}

export default Layout;
