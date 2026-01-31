'use client';
import React, { use, useContext } from 'react'
import Navbar from '@/components/navbar'
import List from '@/components/list'
import { sessionContext } from '../page';

const Home = () => {

  const session = useContext(sessionContext);

  if (!session) {
    console.log("Session :", session);;
  }

  return (
<div>
        <Navbar />
        <List />
    </div>
  )
}

export default Home
