import { create } from 'zustand'

interface PhotoModalState {
    // ID of the photo currently selected for viewing. Null if the modal is closed.
    selectedPhotoId: string | null
    // Function to open the modal with a specific photo ID
    openModal: (photoId: string) => void
    // Function to close the modal
    closeModal: () => void
}

/**
 * Zustand store for managing the Photo Details Modal state.
 * Using Zustand as a simple and efficient way to share state between MapComponent and Dashboard/Modal.
 */
export const usePhotoModal = create<PhotoModalState>((set) => ({
    selectedPhotoId: null,
    openModal: (photoId) => set({ selectedPhotoId: photoId }),
    closeModal: () => set({ selectedPhotoId: null }),
}))
