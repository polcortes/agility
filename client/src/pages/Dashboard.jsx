// import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'


const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Els teus projectes | Agility</title>
        <meta name="description" content="Projectes" />
      </Helmet>

      <h1>Dashboard</h1>
    </>
  )
}

export default Dashboard