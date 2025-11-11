'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { useState } from 'react'
import { AuthFields } from './AuthFields'
import { Social } from './Social'
import { useAuthForm } from './useAuthForm'

export function Auth() {
  const [isReg, setIsReg] = useState(false)
  const { onSubmit, form, isPending } = useAuthForm(isReg)

  return (
		<Card className='w-full max-w-md'> 
			<CardHeader >
				<CardTitle className='text-2xl'>
					{isReg ? 'Create account' : 'Sign in account'}
				</CardTitle>
				<CardDescription>
					Enter your details to {isReg ? 'create' : 'sign in to'} your account.
				</CardDescription>
			</CardHeader>
			
			<CardContent className='space-y-6'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<AuthFields
							form={form}
							isPending={isPending}
							isReg={isReg}
						/>
						<Button type='submit' className='w-full' disabled={isPending}>
							{isReg ? 'Sign up' : 'Continue'}
						</Button>
					</form>
				</Form>

				<Social />
				
			</CardContent>
			
			<CardFooter className='justify-center text-sm space-x-1 border-t pt-4'>
				<p className='text-gray-500'>
						{isReg ? 'Already have an account?' : 'No account yet?'}
				</p>
				<Button variant='link' type='button' onClick={() => setIsReg(!isReg)} className='p-0 h-auto text-blue-600 dark:text-blue-400'>
					{isReg ? 'Sign in' : 'Sign up'}
				</Button>
			</CardFooter>
		</Card>
  )
}
