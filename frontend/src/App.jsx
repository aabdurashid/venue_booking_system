import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import About from './pages/About'
import './App.css'
import Footer from './components/Footer'
import Admin from './pages/Admin'
import AddVenue from './components/adminComponents/AddVenue'
import AllOwners from './components/adminComponents/AllOwners'
import AddOwner from './components/adminComponents/AddOwner'
import AllBookings from './components/adminComponents/AllBookings'
import Owner from './pages/Owner'
import VenueDetails from './components/adminComponents/VenueDetails'
import EditVenue from './components/adminComponents/EditVenue'
import VenueDetail from './components/userComponents/VenueDetail'
import VenuesDetails from './components/ownerComponents/VenuesDetails'
import UpdateVenue from './components/ownerComponents/UpdateVenue'
import AddVenues from './components/ownerComponents/AddVenues'
import AllBooking from './components/ownerComponents/AllBooking'



function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='admin-dashboard' element={<Admin />} />
          <Route path='/admin-dashboard/add-venue' element={<AddVenue />} />
          <Route path='/admin-dashboard/add-owner' element={<AddOwner />} />
          <Route path='/admin-dashboard/all-owners' element={<AllOwners />} />
          <Route path='/admin-dashboard/all-bookings' element={<AllBookings />} />
          <Route path='/venue/:id' element={<VenueDetails />} />
          <Route path='/venue/:id/edit' element={<EditVenue />} />
          <Route path='/owner-dashboard' element={<Owner />} />
          <Route path='/venues/:id' element={<VenueDetail />} />
          <Route path='/venuue/:id' element={<VenuesDetails />} />
          <Route path='/venues/:id/edit' element={<UpdateVenue />} />
          <Route path='/owner-dashboard/add-venue' element={<AddVenues />} />
          <Route path='/owner-dashboard/all-bookings' element={<AllBooking />} />
  
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App