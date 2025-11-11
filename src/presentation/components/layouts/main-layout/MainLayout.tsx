import { PropsWithChildren } from 'react'

import { Footer } from './footer/Footer'
import { Header } from './header/Header'

export function MainLayout({ children }: PropsWithChildren<unknown>) {
	return (
		<div className='flex h-full'>
			<div >
				<Header />
				<main>{children}</main>
				<Footer/>
			</div>
		</div>
	)
}
