import { Outlet } from 'react-router-dom'
import Header from '../components/header/header.jsx'

export default function HomeLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}
