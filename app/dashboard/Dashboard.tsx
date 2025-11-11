'use client'

import { useMutation } from '@tanstack/react-query'
import { LogOut } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { saveTokenStorage } from '@/src/services/auth/auth-token.service'
import { authService } from '@/src/services/auth/auth.service'
import { useProfile } from '@/src/shared/application/hooks/useProfile'

export function Dashboard() {
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		const accessToken = searchParams.get('accessToken')

		if (accessToken) saveTokenStorage(accessToken)
	}, [searchParams])

	const { user } = useProfile()

	const { mutate: logout } = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => authService.logout(),
		onSuccess: () => router.push('/auth')
	})

	if (!user) return null


	return (
		<div>
			<div >
				<h1>Dashboard</h1>
				<Button variant='ghost' onClick={() => logout()}>
					<LogOut />
					Выйти
				</Button>
			</div>
		</div>
	)
}
