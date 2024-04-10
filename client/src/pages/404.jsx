import { useTranslation } from "react-i18next"

import { Helmet } from "react-helmet-async"

import { Link } from "react-router-dom"

const Error404 = () => {
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>Oops, not found! | Agility</title>
      </Helmet>
      <main className="bg-slate-900/80">
        <h1>{ t("404.title") }</h1>
        <Link to="./dashboard/">{ t("404.link") }</Link>
      </main>
    </>
  )
}

export default Error404