'use client'

import { useState } from 'react'

export default function SyncUsersPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSyncUsers = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/sync-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.message || 'Failed to sync users')
      }
    } catch (err) {
      setError('An error occurred while syncing users')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4>Admin: Sync Users</h4>
            </div>
            <div className="card-body">
              <p className="text-muted mb-4">
                This tool will sync existing Supabase Auth users with your Prisma database. 
                Use this if you have users who signed up before the database trigger was in place.
              </p>

              <div className="d-grid gap-3">
                <button
                  className="btn btn-primary"
                  onClick={handleSyncUsers}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Syncing Users...
                    </>
                  ) : (
                    'Sync Users'
                  )}
                </button>
              </div>

              {error && (
                <div className="alert alert-danger mt-3">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {result && (
                <div className="alert alert-success mt-3">
                  <i className="fas fa-check-circle me-2"></i>
                  <strong>Sync completed successfully!</strong>
                  <br />
                  Users synced: {result.result?.syncedCount || 0}
                  <br />
                  Errors: {result.result?.errorCount || 0}
                </div>
              )}

              <div className="mt-4">
                <h6>What this does:</h6>
                <ul className="text-muted">
                  <li>Fetches all users from Supabase Auth</li>
                  <li>Creates corresponding records in your Prisma database</li>
                  <li>Resolves the &quot;user logged in but database empty&quot; issue</li>
                  <li>Only creates users that don't already exist in the database</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
