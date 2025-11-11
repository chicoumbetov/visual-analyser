import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { DASHBOARD_URL } from '@/src/config/url.config'
import { authService } from '@/src/services/auth/auth.service'
import { IAuthForm } from '@/src/shared/domain/entities/auth.interface'

import { useAuthContext } from './AuthContext'

export function useAuthForm(isReg: boolean) {
    const router = useRouter()

    const { setUser } = useAuthContext() 

    const form = useForm<IAuthForm>({
        mode: 'onChange'
    })

    const { mutate, isPending } = useMutation({
        mutationKey: ['auth user', isReg ? 'register' : 'login'],
        mutationFn: (data: IAuthForm) =>
            authService.main(isReg ? 'register' : 'login', data),
        onSuccess({ data }) {
            form.reset()
            setUser(data.user) // * Update global user state
            toast.success('Successfull authorization')
            router.replace(DASHBOARD_URL.home())
        },
        onError(error) {
            if (error.message) {
                toast.error(error.message)
            } else {
                toast.error('Authorization error')
            }
        }
    })

    const onSubmit: SubmitHandler<IAuthForm> = data => {
        mutate(data)
    }

    return { onSubmit, form, isPending }
}
