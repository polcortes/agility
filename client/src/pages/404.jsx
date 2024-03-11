import { useTranslation } from "react-i18next"

import { Helmet } from "react-helmet-async"

const Error404 = () => {
  const { t } = useTranslation()

  return (
    <>
     <Helmet>
      
     </Helmet>
      <main className="bg-slate-900/80">
        <h1>{ t("404.title") }</h1>
        <a href="#">{ t("404.link") }</a>
      </main>
    </>
  )
}

export default Error404