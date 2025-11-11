'use client'

import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'

import { Button } from '@/components/ui/button'
import { SERVER_URL } from '@/src/config/api.config'

export function Social() {
	const router = useRouter()

	return (
		<div>
			<Button
				variant='outline'
				onClick={() => router.push(`${SERVER_URL}/auth/google`)}
			>
				<FcGoogle />
				Continue with Google
			</Button>
			
		</div>
	)
}
