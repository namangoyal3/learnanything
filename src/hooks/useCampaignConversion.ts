'use client'

import { useEffect, useRef } from 'react'
import posthog from 'posthog-js'
import { getStoredCampaign } from '@/lib/utm'

type ConversionEvent = 
  | 'viewed_pricing'
  | 'viewed_checkout'
  | 'started_checkout'
  | 'completed_purchase'
  | 'signed_up'

export function useCampaignConversion() {
  const tracked = useRef<Set<string>>(new Set())

  const trackConversion = (event: ConversionEvent, properties?: Record<string, unknown>) => {
    const campaign = getStoredCampaign()
    const eventKey = `${event}-${campaign?.campaign_source || 'direct'}`
    
    if (tracked.current.has(eventKey) && event !== 'completed_purchase') {
      return
    }
    
    tracked.current.add(eventKey)
    
    posthog.capture(event, {
      ...campaign,
      ...properties,
      converted: true,
    })
  }

  return { trackConversion }
}

export function trackPageView(pageName: string) {
  const campaign = getStoredCampaign()
  
  posthog.capture('page_viewed', {
    page: pageName,
    ...campaign,
  })
}
