'use client'

import { useEffect } from 'react'
import { captureCampaignData, getStoredCampaign } from '@/lib/utm'
import posthog from 'posthog-js'

export default function CampaignTracker() {
  useEffect(() => {
    captureCampaignData()
    
    const stored = getStoredCampaign()
    if (stored) {
      posthog.register(stored)
    }
  }, [])

  return null
}
