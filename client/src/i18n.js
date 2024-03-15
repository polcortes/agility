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
          home: {
            seoTitle: 'Agility - Your Scrum projects manager',
            seoDescription: 'Agility is a Scrum project manager that allows you to manage your projects faster than ever.',

            description1: 'Manage your Scrum projects',
            description2: 'faster than ever',
            accessAccount: 'Log in or sign up!'
          },
          404: {
            title: '404 - Page Not Found',
            link: "Go back to home 🏠"
          }
        }
      },
      es: {
        translation: {
          home: {
            seoTitle: 'Agility - Tu gestor de proyectos Scrum',
            seoDescription: 'Agility es un gestor de proyectos Scrum que te permite gestionar tus proyectos más rápido que nunca.',

            description1: 'Gestiona tus proyectos de Scrum',
            description2: 'más rápido que nunca',
            accessAccount: '¡Inicia sesión o regístrate!'
          },
          404: {
            title: '404 - Página no encontrada',
            link: "Volver a la página principal 🏠"
          }
        }
      },
      ca: {
        translation: {
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
          404: {
            title: '404 - Pàgina no trobada',
            link: "Tornar a la pàgina principal 🏠"
          }
        }
      }
    }
  })

export default i18n