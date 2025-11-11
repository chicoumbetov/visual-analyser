import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/src/presentation/constants/seo.constants'
import { Dashboard } from './Dashboard'

export const metadata: Metadata = {
	title: 'Settings',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return <Dashboard />
}
