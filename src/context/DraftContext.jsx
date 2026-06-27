/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const DraftContext = createContext()

export function DraftProvider({ children }) {
  const [draftData, setDraftData] = useState({
    groomName: '',
    brideName: '',
    weddingDate: '',
    weddingMonth: '',
    weddingYear: '',
    mahalName: '',
    venueAddress: '',
    venueCity: '',
    state: '',
    mapLink: '',
    showGallery: true,
    showSchedule: true,
    photos: [null, null, null],
    scheduleItems: [
      { time: '11:00 AM', title: 'Haldi Ceremony' },
      { time: '04:00 PM', title: 'Wedding Vows' },
      { time: '07:00 PM', title: 'Grand Reception' }
    ],
    code: null,
    status: 'DRAFT',
    amountPaid: 0
  })

  const updateDraft = (newData) => {
    setDraftData(prev => ({ ...prev, ...newData }))
  }

  const resetDraft = () => {
    setDraftData({
      groomName: '',
      brideName: '',
      weddingDate: '',
      weddingMonth: '',
      weddingYear: '',
      mahalName: '',
      venueAddress: '',
      venueCity: '',
      state: '',
      mapLink: '',
      showGallery: true,
      showSchedule: true,
      photos: [null, null, null],
      scheduleItems: [
        { time: '11:00 AM', title: 'Haldi Ceremony' },
        { time: '04:00 PM', title: 'Wedding Vows' },
        { time: '07:00 PM', title: 'Grand Reception' }
      ],
      code: null,
      status: 'DRAFT',
      amountPaid: 0
    })
  }

  return (
    <DraftContext.Provider value={{ draftData, updateDraft, resetDraft }}>
      {children}
    </DraftContext.Provider>
  )
}

export function useDraft() {
  return useContext(DraftContext)
}
