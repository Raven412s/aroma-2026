import { PropsWithChildren } from 'react'

const NavFooterWrapperLayout = ({children}:PropsWithChildren) => {
  return (
    <div>
        <main className='pt-20'>
        {children}
        </main>
    </div>
  )
}

export default NavFooterWrapperLayout
