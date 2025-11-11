'use client'

import { photoService } from '@/src/photo/services/photo.service'
import { ICommentRdo, ICreateCommentForm } from '@/src/shared/domain/entities/comment.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Send, User } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'

interface CommentSectionProps {
    photoId: string
    comments: ICommentRdo[]
}

export function CommentSection({ photoId, comments }: CommentSectionProps) {
    const queryClient = useQueryClient()
    const form = useForm<ICreateCommentForm>({
        defaultValues: { text: '' },
        mode: 'onChange',
    })

    const { mutate, isPending } = useMutation({
        mutationKey: ['add comment', photoId],
        mutationFn: (data: ICreateCommentForm) => photoService.addComment(photoId, data),
        onSuccess: () => {
            toast.success('Comment posted!')
            form.reset()
            // Invalidate the photo details query to refetch comments
            queryClient.invalidateQueries({ queryKey: ['photo details', photoId] })
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to post comment.')
        }
    })

    const onSubmit: SubmitHandler<ICreateCommentForm> = data => {
        if (data.text.trim()) {
            mutate(data)
        }
    }

    return (
        <div className='mt-6 space-y-4'>
            <h3 className='text-lg font-semibold'>Comments ({comments.length})</h3>
            
            {/* Comment Submission Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
                    <FormField
                        control={form.control}
                        name='text'
                        rules={{ required: 'Comment cannot be empty' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea 
                                        placeholder='Add a comment...' 
                                        disabled={isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex justify-end'>
                        <Button type='submit' size='sm' disabled={isPending}>
                            <Send className='w-4 h-4 mr-2' /> 
                            {isPending ? 'Posting...' : 'Post Comment'}
                        </Button>
                    </div>
                </form>
            </Form>

            {/* Existing Comments List */}
            <div className='pt-2 max-h-60 overflow-y-auto space-y-3'>
                {comments.length === 0 ? (
                    <p className='text-sm text-muted-foreground italic'>No comments yet. Be the first!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className='p-3 bg-secondary/30 rounded-lg'>
                            <div className='flex items-center justify-between text-xs text-muted-foreground'>
                                <span className='font-medium text-primary flex items-center gap-1'>
                                    <User className='w-3 h-3'/> {comment.user.name || 'Anonymous'}
                                </span>
                                <span>{format(new Date(comment.createdAt), 'MMM d, yyyy')}</span>
                            </div>
                            <p className='mt-1 text-sm'>{comment.text}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
