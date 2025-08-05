import React from 'react'
import Feed from './feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'

function Home() {
  return (
    <div className='flex'>
        <div className='flex-grow'>
            <Feed />
            <Outlet />
        </div>
        < RightSidebar />
    </div>
  )
}

export default Home
