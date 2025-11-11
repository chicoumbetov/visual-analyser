import type { Metadata } from 'next'

import { Home } from './Home'

export const metadata: Metadata = {
	title: 'Analyse image'
}

export const revalidate = 60

export default async function HomePage() {

	return <Home />
}
