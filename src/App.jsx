import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import FirstRow from './components/FirstRow'
import RunningTimeChart from './components/RunningTimeChart'
import Availability from './components/Availability'
import Quality from './components/Quality'
import QualityForm from './components/QualityForm';



// const Quality = () => (
//   <div className="p-4">
//     <h1 className="text-2xl font-bold text-[#8B4513]">Quality Details</h1>
//     {/* Add your quality page content here */}
//   </div>
// )

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen bg-white ">
        <Header />
        <div className="min-h-[calc(100vh-64px)] p-2">
          <Routes>
            <Route path="/" element={
              <>
                <FirstRow />
                <div className="mt-2">
                  <RunningTimeChart />
                </div>
              </>
            } />
            <Route path="/availability" element={<Availability />} />
            <Route path="/quality" element={<Quality />} />
            <Route path="/form" element={<QualityForm />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App