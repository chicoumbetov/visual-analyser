'use client'

import { Loader, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { DASHBOARD_URL, PUBLIC_URL } from '@/src/config/url.config'
import { useProfile } from '@/src/shared/application/hooks/useProfile'

export function HeaderMenu() {
	const { user, isLoading } = useProfile()

	return (
		<div >
			<Link href={PUBLIC_URL.home()}>
				<Button variant='ghost'>Home</Button>
			</Link>
			{isLoading ? (
				<Loader size='sm' />
			) : user ? (
				<>
					<Link href={DASHBOARD_URL.home()}>
						<Button variant='ghost'>HOME</Button>
					</Link>

					<Link href={DASHBOARD_URL.home()}>
						<Image
							src={user.picture}
							alt={user.name ?? 'user name'}
							width={42}
							height={42}
						/>
					</Link>
				</>
			) : (
				<Link href={PUBLIC_URL.auth()}>
					<Button >
						<LogOut />
						Sign Out
					</Button>
				</Link>
			)}
		</div>
	)
}
