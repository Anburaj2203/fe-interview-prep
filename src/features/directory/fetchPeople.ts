import { requestJson } from '../../api/client'
import { DIRECTORY_API_BASE_URL } from '../../config/env'
import type { Person } from './types'

const DIRECTORY_SIZE = 500
const DIRECTORY_SEED = 'fe-interview-prep'
const DIRECTORY_PATH = `/?results=${DIRECTORY_SIZE}&seed=${DIRECTORY_SEED}&inc=name,email,location,login`

type DirectoryResponse = {
  results: {
    name: { first: string; last: string }
    email: string
    location: { city: string; country: string }
    login: { uuid: string }
  }[]
}

export async function fetchPeople(signal?: AbortSignal): Promise<Person[]> {
  const response = await requestJson<DirectoryResponse>(
    DIRECTORY_PATH,
    signal,
    DIRECTORY_API_BASE_URL,
  )

  return response.results.map((result) => ({
    id: result.login.uuid,
    name: `${result.name.first} ${result.name.last}`,
    email: result.email,
    city: result.location.city,
    country: result.location.country,
  }))
}
