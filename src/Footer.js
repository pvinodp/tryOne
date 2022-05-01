import React from 'react'

const Footer = () => {
  const todaysDate = new Date();

  return (
    <footer className='Footer'>
        <p> CopyRight {todaysDate.getFullYear()} </p>
        </footer>
  )
}

export default Footer