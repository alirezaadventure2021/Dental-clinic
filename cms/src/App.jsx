import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRouter from './router'

const basename = import.meta.env.PROD ? '/cms' : undefined

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  )
}
