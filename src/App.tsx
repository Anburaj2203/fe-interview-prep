import { ProductSearch } from './features/search/ProductSearch'
import { RegisterWizard } from './features/register/RegisterWizard'

import './App.css'

export default function App() {
  return (
    <main className="app">
      <h1 className="app__title">FE Interview Prep</h1>
      <ProductSearch />
      <RegisterWizard />
    </main>
  )
}
