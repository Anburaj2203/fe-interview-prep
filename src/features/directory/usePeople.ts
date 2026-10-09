import { useEffect, useState } from 'react'

import { fetchPeople } from './fetchPeople'
import type { DirectoryStatus, Person } from './types'

type DirectoryData = {
  status: DirectoryStatus
  people: Person[]
}

export function usePeople(): DirectoryData {
  const [data, setData] = useState<DirectoryData>({ status: 'loading', people: [] })

  useEffect(() => {
    const controller = new AbortController()
    let ignore = false

    fetchPeople(controller.signal)
      .then((people) => {
        if (!ignore) {
          setData({ status: 'ready', people })
        }
      })
      .catch(() => {
        if (!ignore) {
          setData({ status: 'error', people: [] })
        }
      })

    return () => {
      ignore = true
      controller.abort()
    }
  }, [])

  return data
}
