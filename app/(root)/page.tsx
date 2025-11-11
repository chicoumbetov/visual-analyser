import type { Metadata } from 'next'

import { Home } from './Home'

export const metadata: Metadata = {
	title: 'You shopping, your pleasure - all in one place !'
}

export const revalidate = 60

export default async function HomePage() {

	return <Home />
}
