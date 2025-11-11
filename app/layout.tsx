import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'

import { SITE_DESCRIPTION, SITE_NAME } from '@/src/presentation/constants/seo.constants'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
	title: {
		absolute: SITE_NAME,
		template: `%s | ${SITE_NAME}`
	},
	description: SITE_DESCRIPTION
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${GeistSans.variable} antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
