import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)  // detect user language
  .use(initReactI18next)  // pass the i18n instance to react-i18next
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    // There's where you'll be able to write all of your
    // translations for your React app.
    resources: {
      en: {
        translation: {
          userMenu: {
            title: 'Settings',
            theme: 'App theme:',
            language: 'App language:',
            logout: 'Log out'
          },
          home: {
            seoTitle: 'Agility - Your Scrum projects manager',
            seoDescription: 'Agility is a Scrum project manager that allows you to manage your projects faster than ever.',

            description1: 'Manage your Scrum projects',
            description2: 'faster than ever',
            loginMessage: 'Log in',
            loginUsername: 'Username or email',
            loginPassword: 'Password',
            loginButton: 'Log in',
            registerLink: 'Create a new account',

            registerMessage: 'Register',
            registerUsername: 'Username',
            registerEmail: 'Email',
            registerPassword: 'Password',
            registerRepeatPassword: 'Confirm your password',
            registerButton: 'Register',
            loginLink: 'Log in',

            googleButton: 'Sign in with Google',
          },
          dashboard: {
            seoTitle: 'Your projects | Agility',
            seoDescription: 'Manage your Scrum projects with Agility.',

            title: 'Projects',
            createProjectBtn: 'Create project',
            createProjectTitle: 'Project title',
            createProjectTitlePlaceholder: 'Example title...',
            createProjectCreateBtn: 'Create',
            createProjectError: 'The title is not valid.',
            searchProjects: 'Search projects',
            searchResults: 'Search results',
            searchNoResults: 'No results found',

            projectOwner: 'By: '
          },
          404: {
            title: '404 - Page Not Found',
            link: "Go back to home 🏠"
          },
          403: {
            title: '403 - Forbidden',
            link: "Go back to home 🏠"
          }
        }
      },
      es: {
        translation: {
          userMenu: {
            title: 'Configuración',
            theme: 'Tema de la aplicación:',
            language: 'Idioma de la aplicación:',
            logout: 'Cerrar sesión'
          },
          home: {
            seoTitle: 'Agility - Tu gestor de proyectos Scrum',
            seoDescription: 'Agility es un gestor de proyectos Scrum que te permite gestionar tus proyectos más rápido que nunca.',

            description1: 'Gestiona tus proyectos de Scrum',
            description2: 'más rápido que nunca',
            loginMessage: 'Iniciar sesión',
            loginUsername: 'Nombre de usuario o correo electrónico',
            loginPassword: 'Contraseña',
            loginButton: 'Iniciar sesión',
            registerLink: 'Crear una cuenta nueva',

            registerMessage: 'Regístrate',
            registerUsername: 'Nombre de usuario',
            registerEmail: 'Correo electrónico',
            registerPassword: 'Contraseña',
            registerRepeatPassword: 'Confirma tu contraseña',
            registerButton: 'Registrarse',
            loginLink: 'Iniciar sesión',

            googleButton: 'Entrar con Google',
          },
          dashboard: {
            seoTitle: 'Tus proyectos | Agility',
            seoDescription: 'Gestiona tus proyectos de Scrum con Agility.',

            title: 'Proyectos',
            createProjectBtn: 'Crear proyecto',
            createProjectTitle: 'Título del proyecto',
            createProjectTitlePlaceholder: 'Título de ejemplo...',
            createProjectCreateBtn: 'Crear',
            createProjectError: 'El título no es válido.',
            searchProjects: 'Buscar proyectos',
            searchResults: 'Resultados de la búsqueda',
            searchNoResults: 'No se han encontrado resultados',

            projectOwner: 'De: '
          },
          404: {
            title: '404 - Página no encontrada',
            link: "Volver a la página principal 🏠"
          },
          403: {
            title: '403 - Prohibido',
            link: "Volver a la página principal 🏠"
          }
        }
      },
      ca: {
        translation: {
          userMenu: {
            title: 'Configuració',
            theme: 'Tema de l\'aplicació:',
            language: 'Idioma de l\'aplicació:',
            logout: 'Tancar sessió'
          },
          home: {
            seoTitle: 'Agility - El teu gestor de projectes Scrum',
            seoDescription: 'Agility és un gestor de projectes Scrum que et permet gestionar els teus projectes més ràpid que mai.',

            description1: 'Gestiona els teus projectes de Scrum',
            description2: 'més ràpid que mai',
            loginMessage: 'Inicia sessió',
            loginUsername: 'Nom d\'usuari o correu electrònic',
            loginPassword: 'Contrasenya',
            loginButton: 'Iniciar sessió',
            registerLink: 'Crear un compte nou',

            registerMessage: 'Registra\'t',
            registerUsername: 'Nom d\'usuari',
            registerEmail: 'Correu electrònic',
            registerPassword: 'Contrasenya',
            registerRepeatPassword: 'Confirma la teva contrasenya',
            registerButton: 'Registrar-se',
            loginLink: 'Inicia sessió',

            googleButton: 'Entra amb Google',
          },
          dashboard: {
            seoTitle: 'Els teus projectes | Agility',
            seoDescription: 'Gestiona els teus projectes de Scrum amb Agility.',

            title: 'Projectes',
            createProjectBtn: 'Crear projecte',
            createProjectTitle: 'Títol del projecte',
            createProjectTitlePlaceholder: 'Títol d\'exemple...',
            createProjectCreateBtn: 'Crear',
            createProjectError: 'El títol no es vàlid.',
            searchProjects: 'Cerca projectes',
            searchResults: 'Resultats de la cerca',
            searchNoResults: 'No s\'han trobat resultats',

            projectOwner: 'De: '
          },
          404: {
            title: '404 - Pàgina no trobada',
            link: "Tornar a la pàgina principal 🏠"
          },
          403: {
            title: '403 - Prohibit',
            link: "Tornar a la pàgina principal 🏠"
          }
        }
      }
    }
  })

export default i18n