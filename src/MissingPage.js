import React from 'react'
import { Link } from 'react-router-dom';

const MissingPage = () => {
  return (
    <main className ="Missing">
      <h1>Page Not Found</h1>
      <p> Hit below if u want to get out of here</p>
      <p> <Link to = '/'> home page</Link></p>
    </main>
  )
}

export default MissingPage