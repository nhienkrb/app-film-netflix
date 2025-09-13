import React from 'react'
import { getSession } from '../lib/auth'
export default function Account() {
  const s = getSession();
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold">Account</h1>
      <pre className="text-xs bg-gray-50 p-2 rounded border">{JSON.stringify(s.payload, null, 2)}</pre>
    </div>
  )
}
