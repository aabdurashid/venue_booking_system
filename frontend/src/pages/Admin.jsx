import React from 'react'
import MainFunc from '../components/adminComponents/MainFunc'
import Venues from '../components/adminComponents/Venues'

function Admin() {
  return (
    <div className='dashboard-section'>
        <div className='container'>
            <MainFunc />
            <Venues />
        </div>
    </div>
  )
}

export default Admin