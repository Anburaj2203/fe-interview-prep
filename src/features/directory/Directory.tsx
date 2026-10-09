import { DataTable } from '../../components/DataTable/DataTable'
import { useTableViewState } from '../../components/DataTable/useTableViewState'
import type { Column } from '../../components/DataTable/types'
import type { Person } from './types'
import { usePeople } from './usePeople'

import './Directory.css'

const COLUMNS: Column<Person>[] = [
  { key: 'name', header: 'Name', value: (person) => person.name, sortable: true },
  { key: 'email', header: 'Email', value: (person) => person.email, sortable: true },
  { key: 'city', header: 'City', value: (person) => person.city, sortable: true },
  {
    key: 'country',
    header: 'Country',
    value: (person) => person.country,
    sortable: true,
    filterable: true,
  },
]

function personId(person: Person) {
  return person.id
}

export function Directory() {
  const { status, people } = usePeople()
  const [view, changeView] = useTableViewState()

  if (status === 'loading') {
    return <p className="directory__message">Loading the directory…</p>
  }

  if (status === 'error') {
    return <p className="directory__message">The directory could not be loaded.</p>
  }

  if (people.length === 0) {
    return <p className="directory__message">The directory has no records.</p>
  }

  return (
    <DataTable
      rows={people}
      columns={COLUMNS}
      rowKey={personId}
      caption="People directory"
      view={view}
      onViewChange={changeView}
    />
  )
}
