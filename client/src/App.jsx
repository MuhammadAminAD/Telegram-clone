import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import SubmitCode from './pages/SubmitCode'
import { Context } from './Context/Context'
import { useEffect, useState } from 'react'
import UserDetailsForm from './pages/UserDetailFill'
import Home from './pages/Home'
import userServices from './service/user.service'
import RightText from './Components/RightText'
import { send_socketID } from './utils/socket.io'

export default function App() {
      // user's email
      const [email, setEmail] = useState()
      // user's all info
      const [userdata, setuserdata] = useState({})
      const navigate = useNavigate()




      // sendToken
      useEffect(() => {
            const token = localStorage.getItem('token')
            if (!token) return navigate('/login')
            const checkAuth = async () => {
                  try {
                        const response = await userServices.sendToken(token)

                        if (response?.status === 200 && response?.info) {
                              setuserdata(response.info)
                              send_socketID(response.info.email)
                              // navigate('/home')
                        }
                        else {
                              //navigate('/login')
                        }
                  } catch (error) {
                        // navigate('/login')
                  }
            }
            checkAuth()
      }, [])

      return (
            <>
                  <Context.Provider value={{ email, setEmail, userdata }}>
                        <Routes>
                              <Route path="/Text" element={<RightText />} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/submit_code" element={<SubmitCode />} />
                              <Route path="/user_details_form" element={<UserDetailsForm />} />
                              <Route path="/home" element={<Home />} />
                        </Routes>
                  </Context.Provider>
            </>
      )
}
