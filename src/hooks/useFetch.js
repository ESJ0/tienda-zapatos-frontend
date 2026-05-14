import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'

export function useFetch(url, dependencies = []) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetch = useCallback(async() => {
        if (!url) return
        setLoading(true)
        setError(null)
        try {
            const { data: result } = await api.get(url)
            setData(result)
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar datos')
        } finally {
            setLoading(false)
        }
    }, [url, ...dependencies])

    useEffect(() => {
        fetch()
    }, [fetch])

    return { data, loading, error, refetch: fetch }
}