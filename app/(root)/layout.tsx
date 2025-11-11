import type { PropsWithChildren } from 'react'

import { MainLayout } from '@/presentation/components/layouts/main-layout/MainLayout'

export default function Layout({ children }: PropsWithChildren<unknown>) {
	return <MainLayout>{children}</MainLayout>
}
