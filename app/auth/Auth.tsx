'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'

import { AuthFields } from './AuthFields'
import { Social } from './Social'
import { useAuthForm } from './useAuthForm'

export function Auth() {
	const [isReg, setIsReg] = useState(false)

	const { onSubmit, form, isPending } = useAuthForm(isReg)

	return (
		<Card>
			<CardHeader >
				<CardTitle>
					{isReg ? 'Create account' : 'Sign in account'}
				</CardTitle>
				<CardDescription>
					Enter or create account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<AuthFields
							form={form}
							isPending={isPending}
							isReg={isReg}
						/>

						<Button disabled={isPending}>Continue</Button>
					</form>
				</Form>
				<Social />
			</CardContent>
			<CardFooter >
				{isReg ? 'Already have account ?' : 'No account yet?'}
				<button onClick={() => setIsReg(!isReg)}>
					{isReg ? 'Sign in' : 'Sign up'}
				</button>
			</CardFooter>
		</Card>
	)
}
