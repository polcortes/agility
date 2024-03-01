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
            description1: 'Gestiona els teus projectes de Scrum',
            description2: 'més ràpid que mai',
            accessAccount: 'Inicia sessió o registra\'t!'
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