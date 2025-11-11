'use client'

import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'

import { Button } from '@/components/ui/button'
import { SERVER_URL } from '@/src/config/api.config'
import styles from './Auth.module.css'

export function Social() {
	const router = useRouter()

	return (
		<div className={styles.social}>
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
