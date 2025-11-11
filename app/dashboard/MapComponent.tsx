'use client'

import { useQuery } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import maplibregl, { Map, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { photoService } from '@/src/photo/services/photo.service';
import { IPhotoRdo } from '@/src/shared/domain/entities/photo.interface';
import { usePhotoModal } from './usePhotoModal';

const DEFAULT_CENTER: [number, number] = [34.0, 48.0] // Center of Eurasia / central region
const DEFAULT_ZOOM = 3

export function MapComponent() {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<Map | null>(null)
    const [markers, setMarkers] = useState<Marker[]>([])

    const { data: photos, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['get all photos'],
        queryFn: () => photoService.getAll(),
        staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    })

    // * Map Initialization and Marker Rendering Effect
    useEffect(() => {
        if (!mapContainerRef.current) return

        if (!mapRef.current) {
            // Initialize the map if it doesn't exist
            mapRef.current = new Map({
                container: mapContainerRef.current,
                style: 'https://tiles.stadiamaps.com/styles/osm_bright.json', // A free, common tile style
                center: DEFAULT_CENTER,
                zoom: DEFAULT_ZOOM,
                attributionControl: false,
            })

            mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right')
        }

        const mapInstance = mapRef.current
        const { openModal } = usePhotoModal.getState()

        // Clean up old markers
        markers.forEach(marker => marker.remove())
        const newMarkers: Marker[] = []

        if (isSuccess && photos && photos.length > 0) {
            
            // Calculate bounds to fit all markers
            const bounds = new maplibregl.LngLatBounds()

            photos.forEach((photo: IPhotoRdo) => {
                const { latitude, longitude, title, imageUrl, id } = photo
                
                // Create a custom marker element
                const el = document.createElement('div')
                el.className = 'map-marker'
                el.innerHTML = '<svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6 text-red-500 hover:text-red-700 transition-colors"><path d="M10 2a6 6 0 00-6 6c0 4.418 5.4 10.4 6 10.4s6-5.982 6-10.4a6 6 0 00-6-6zm0 9a3 3 0 110-6 3 3 0 010 6z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>'
                
                // Add click handler to the marker element
                el.addEventListener('click', () => {
                    openModal(id) // Opens the modal with the photo ID
                })
                
                // Create a marker instance
                const marker = new maplibregl.Marker({ element: el })
                    .setLngLat([longitude, latitude])
                    // REMOVE setPopup line if it exists
                    .addTo(mapInstance)
                
                newMarkers.push(marker)

                bounds.extend([longitude, latitude])
            })
            
            setMarkers(newMarkers)

            // Fit the map to the bounds of all photos if there are markers
            mapInstance.fitBounds(bounds, {
                padding: 50,
                duration: 1000,
            })
        }
        return () => {
            // The map instance itself should NOT be removed, just the markers
        }
    }, [photos, isSuccess])

    return (
        <Card className='h-full'>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <MapPin className='w-5 h-5'/> Photo Visualization
                </CardTitle>
            </CardHeader>
            <CardContent className='p-0 h-[calc(100%-80px)]'>
                {isLoading && (
                    <div className='absolute inset-0 flex items-center justify-center bg-background/80 z-10'>
                        <p className='text-lg font-medium'>Loading Map and Photos...</p>
                    </div>
                )}
                {isError && (
                    <div className='absolute inset-0 flex items-center justify-center bg-red-50/80 z-10'>
                        <p className='text-lg font-medium text-red-700'>Error loading photos or map data.</p>
                    </div>
                )}
                <div ref={mapContainerRef} className='map-container h-full w-full rounded-b-xl' />
            </CardContent>
        </Card>
    )
}
