'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import EXIF from 'exif-js'
import { Camera, MapPin, UploadCloud } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { Separator } from '@/components/ui/separator'
import { photoService } from '@/src/photo/services/photo.service'
import { ICreatePhotoForm } from '@/src/shared/domain/entities/photo.interface'

// Utility Functions for EXIF
// * Helper function to convert GPS data arrays (DMS) to decimal degrees (DD)
const convertDMSToDD = (dms: number[], direction: string): number => {
    if (!dms || dms.length < 3) return 0
    const degrees = dms[0]
    const minutes = dms[1]
    const seconds = dms[2]
    
    let dd = degrees + minutes / 60 + seconds / 3600

    // South and West directions are negative
    if (direction === 'S' || direction === 'W') {
        dd = dd * -1
    }
    return dd
}

// Function to read EXIF GPS data from a File object
const getGeoTagsFromFile = (file: File): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    EXIF.getData(file as any, function(this: any) { 
      const latDMS = EXIF.getTag(this, 'GPSLatitude')
      const latRef = EXIF.getTag(this, 'GPSLatitudeRef')
      const lonDMS = EXIF.getTag(this, 'GPSLongitude')
      const lonRef = EXIF.getTag(this, 'GPSLongitudeRef')

      if (latDMS && latRef && lonDMS && lonRef) {
          const latitude = convertDMSToDD(latDMS, latRef)
          const longitude = convertDMSToDD(lonDMS, lonRef)
          
          // Check for valid numbers
          if (isNaN(latitude) || isNaN(longitude)) {
              reject(new Error('Invalid GPS data found in EXIF tags.'))
              return
          }

          resolve({ latitude, longitude })
        } else {
            reject(new Error('EXIF tags do not contain GPS data (Latitude and Longitude).'))
        }
      })
  })
}

export function PhotoUploader() {
    const queryClient = useQueryClient()

    const form = useForm<ICreatePhotoForm>({
        mode: 'onChange',
        defaultValues: {
            title: '',
            latitude: 0,
            longitude: 0,
            image: undefined,
        }
    })

    const { mutate, isPending } = useMutation({
        mutationKey: ['upload photo'],
        mutationFn: (data: ICreatePhotoForm) => photoService.upload(data),
        onSuccess: () => {
            toast.success('Photo uploaded successfully! Marker should appear on the map.')
            form.reset()
            // * Invalidate the query to force the Map component to refetch all photos
            queryClient.invalidateQueries({ queryKey: ['get all photos'] }) 
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to upload photo.')
        }
    })

    // Watch the file input for changes
    const fileWatch = form.watch('image')

    const onSubmit: SubmitHandler<ICreatePhotoForm> = data => {
        if (!data.image) {
            toast.error('Please select an image file.')
            return
        }
        if (data.latitude === 0 && data.longitude === 0) {
             toast.error('Geotags missing. Please upload a geotagged photo.')
             return
        }

        mutate(data)
    }

    // * Effect to read EXIF data whenever a new file is selected
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        form.setValue('image', file, { shouldValidate: true })

        try {
            const { latitude, longitude } = await getGeoTagsFromFile(file)

            form.setValue('latitude', latitude)
            form.setValue('longitude', longitude)
            toast.success('Geotags extracted successfully.')
        } catch (error) {
            form.setValue('latitude', 0)
            form.setValue('longitude', 0)
            toast.error((error as Error).message)
            form.setError('image', { type: 'manual', message: 'No GPS data found.' })
        }
    }

    return (
        <Card className='sticky top-8'>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <UploadCloud className='w-5 h-5'/> Photo Uploader
                </CardTitle>
                <CardDescription>
                    Upload a geotagged photo to be displayed on the map.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        {/* Title Field */}
                        <FormField
                            control={form.control}
                            name='title'
                            rules={{ required: 'Title is required' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder='Scenic view of the lake' 
                                            disabled={isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='image'
                            rules={{ required: 'Image is required' }}
                            render={() => (
                                <FormItem>
                                    <FormLabel>Image File</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='file'
                                            accept='image/jpeg'
                                            onChange={handleFileChange}
                                            disabled={isPending}
                                        />
                                    </FormControl>

                                    {fileWatch && (
                                        <p className='text-xs text-muted-foreground mt-1'>
                                            Selected: **{fileWatch.name}**
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Separator className='my-4' />
                        {/* Geotag Display (Read-Only) */}
                        <div className='space-y-2 text-sm'>
                            <p className='font-semibold flex items-center gap-2'>
                                <MapPin className='w-4 h-4 text-primary'/> Extracted Geotags:
                            </p>
                            <div className='flex justify-between'>
                                <span className='text-muted-foreground'>Latitude:</span>
                                <span className={form.getValues('latitude') === 0 ? 'text-red-500' : 'text-green-600'}>
                                    {form.watch('latitude').toFixed(6)}
                                </span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='text-muted-foreground'>Longitude:</span>
                                <span className={form.getValues('longitude') === 0 ? 'text-red-500' : 'text-green-600'}>
                                    {form.watch('longitude').toFixed(6)}
                                </span>
                            </div>
                            {form.getValues('latitude') === 0 && form.getValues('longitude') === 0 && fileWatch && (
                                <p className='text-xs text-red-500 pt-2'>
                                    ⚠️ No valid GPS data found. Please select a geotagged JPEG image.
                                </p>
                            )}
                        </div>

                        <Button type='submit' className='w-full mt-6' disabled={isPending}>
                            <Camera className='w-4 h-4 mr-2' /> 
                            {isPending ? 'Uploading...' : 'Upload Photo'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
