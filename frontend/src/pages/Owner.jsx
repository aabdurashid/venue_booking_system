import React from 'react'
import MainFunc from '../components/ownerComponents/MainFunc'
import Venues from '../components/ownerComponents/Venues'


function Owner() {
  return (
    <div className='dashboard-section'>
        <div className='container'>
            <MainFunc />
            <Venues />
        </div>
    </div>
  )
}

export default Owner