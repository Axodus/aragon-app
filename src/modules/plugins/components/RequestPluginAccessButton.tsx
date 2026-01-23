'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'

export function RequestPluginAccessButton({ 
  daoAddress, 
  pluginSlug, 
  network 
}: { 
  daoAddress: string
  pluginSlug: string
  network: string
}) {
  const { address } = useAccount()
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')

  const handleRequest = async () => {
    setStatus('pending')
    
    try {
      const response = await fetch('/api/plugin-authorizations/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          daoAddress,
          network,
          pluginSlug,
          requestedBy: address,
        }),
      })

      if (response.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <button
      onClick={handleRequest}
      disabled={status === 'pending' || status === 'success'}
      className="btn-primary"
    >
      {status === 'idle' && '🔒 Request Access'}
      {status === 'pending' && '⏳ Requesting...'}
      {status === 'success' && '✅ Request Sent'}
      {status === 'error' && '❌ Error - Try Again'}
    </button>
  )
}