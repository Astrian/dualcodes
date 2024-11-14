import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home/index.tsx'
import Preferences from './pages/Preferences/index.tsx'
import AccountDetail from './pages/AccountDetail/index.tsx'
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import resources from "./i18n"
import LanguageDetector from 'i18next-browser-languagedetector'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered:', registration);
    }).catch(error => {
      console.log('SW registration failed:', error);
    });
  });
}

i18n.use(initReactI18next).use(LanguageDetector).init({
	resources,
  fallbackLng: "en",
	interpolation: {
		escapeValue: false
	}
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/preferences',
    element: <Preferences />,
  },
  {
    path: '/accounts/:id',
    element: <AccountDetail />,
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer />
    <RouterProvider router={router}/>
  </StrictMode>,
)
