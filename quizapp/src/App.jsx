import Start from './pages/Start'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import { Routes, Route } from 'react-router-dom'



function App() {

  return (
    <>
      <Routes>
        <Route path="/start" element={<Start />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </>
  )
}

export default App