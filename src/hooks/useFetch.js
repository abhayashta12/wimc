import { useState, useCallback } from 'react'

export function useFetch(fetcher) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const result = await fetcher(...args)
      setData(result)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [fetcher])

  return { data, loading, error, execute }
}
