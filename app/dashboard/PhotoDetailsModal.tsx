'use client'

import { useQuery } from '@tanstack/react-query'
import { MapPin, RotateCw, X } from 'lucide-react'
import Image from 'next/image'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { photoService } from '@/src/photo/services/photo.service'
import { format } from 'date-fns'
import { CommentSection } from './CommentSection'
import { usePhotoModal } from './usePhotoModal'

export function PhotoDetailsModal() {
    const { selectedPhotoId, closeModal } = usePhotoModal()

    // 1. Fetch Photo Details
    const { data: photo, isLoading, isError } = useQuery({
        // Key changes based on selectedPhotoId
        queryKey: ['photo details', selectedPhotoId],
        queryFn: () => photoService.getById(selectedPhotoId!),
        enabled: !!selectedPhotoId, // Only run query if a photo ID is selected
    })

    const isDialogOpen = !!selectedPhotoId

    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent className='max-w-2xl p-0 h-[85vh] flex flex-col'>
                <DialogHeader className='p-6 pb-0'>
                    <DialogTitle className='text-2xl font-bold'>
                        {photo?.title || 'Loading Photo Details...'}
                    </DialogTitle>
                </DialogHeader>

                {isLoading && (
                    <div className='flex flex-col items-center justify-center h-full text-lg text-muted-foreground'>
                        <RotateCw className='w-6 h-6 animate-spin mb-2' />
                        Loading Photo Details...
                    </div>
                )}
                
                {isError && (
                    <div className='flex items-center justify-center h-full text-lg text-red-500'>
                        Failed to load photo details. Please try again.
                    </div>
                )}

                {photo && (
                    <div className='flex flex-col h-full overflow-hidden'>
                        {/* Left Side: Photo & Metadata */}
                        <div className='flex flex-row p-3 pl-6 overflow-y-auto'>
                            <div className='relative w-full aspect-[4/3] bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden'>
                                <Image
                                    src={photo.imageUrl}
                                    alt={photo.title}
                                    height={240}
                                    width={413}
                                    objectFit='contain'
                                    className='transition-opacity duration-500'
                                />
                            </div>
                            
                            {/* Metadata */}
                            <div className='mt-4 p-4 bg-secondary/20 rounded-lg text-sm space-y-1'>
                                <p className='font-semibold flex items-center gap-2 text-primary'>
                                    <MapPin className='w-4 h-4'/> Location & Details
                                </p>
                                <p>Uploaded by: **{photo.user.name || 'Anonymous'}**</p>
                                <p>Taken on: {format(new Date(photo.createdAt), 'MMM d, yyyy HH:mm')}</p>
                                <p>Coordinates: **Lat {photo.latitude.toFixed(6)}, Lng {photo.longitude.toFixed(6)}**</p>
                                {photo.aiDescription && (
                                    <p className='mt-2 italic text-muted-foreground'>AI Description: {photo.aiDescription}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Comments */}
                        <div className='w-full p-6 pl-3 border-t dark:border-zinc-700 overflow-y-auto'>
                            <CommentSection photoId={photo.id} comments={photo.comments} />
                        </div>
                    </div>
                )}

                <button onClick={closeModal} className='absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors p-1'>
                    <X className='w-6 h-6' />
                </button>

            </DialogContent>
        </Dialog>
    )
}
