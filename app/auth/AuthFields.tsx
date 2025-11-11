import { Control } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { IAuthForm } from '../../src/shared/domain/entities/auth.interface';
import { validEmail } from '../../src/utils/regex';

interface AuthFieldsProps {
  form: { control: Control<IAuthForm> }
  isPending: boolean
  isReg?: boolean
}

export function AuthFields({
  form,
  isPending,
  isReg = false
}: AuthFieldsProps) {
  return (
    <div className='space-y-4'> 
      {isReg && (
				<FormField<IAuthForm>
					control={form.control}
					name='name'
					rules={{
						required: 'Name required'
					}}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									placeholder='Name'
									disabled={isPending}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			)}
			<FormField<IAuthForm>
				control={form.control}
				name='email'
				rules={{
					required: 'Email required',
					pattern: {
						value: validEmail,
						message: 'Enter valid email'
					}
				}}
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<Input
								placeholder='Email'
								type='email'
								disabled={isPending}
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField<IAuthForm>
				control={form.control}
				name='password'
				rules={{
					required: 'Password required',
					minLength: {
						value: 6,
						message: 'At least 6 symbols required'
					}
				}}
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<Input
								placeholder='Password'
								type='password'
								disabled={isPending}
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
      />
    </div>
  )
}
