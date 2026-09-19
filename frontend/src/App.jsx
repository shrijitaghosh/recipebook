import { Routes, Route } from 'react-router-dom'
import { PantryProvider } from './context/PantryContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Preferences from './pages/Preferences'
import Pantry from './pages/Pantry'
import RecipeDiscovery from './pages/RecipeDiscovery'
import RecipeDetailsPage from './pages/RecipeDetailsPage'

export default function App() {
  return (
    <PantryProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/pantry" element={<Pantry />} />
        <Route path="/discover" element={<RecipeDiscovery />} />
        <Route path="/recipe/:recipeId" element={<RecipeDetailsPage />} />
      </Routes>
    </PantryProvider>
  )
}
