import { Footer, Navbar } from '@/components/global'
import React, { PropsWithChildren } from 'react'

const NavFooterWrapperLayout = ({children}:PropsWithChildren) => {
  return (
    <div>
        <Navbar/>
        <main className=''>
        {children}
        </main>
        <Footer/>
    </div>
  )
}

export default NavFooterWrapperLayout
