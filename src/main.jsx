import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Navigate, createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import '@fontsource-variable/geist'
import '@fontsource-variable/source-serif-4'
import '@fontsource-variable/jetbrains-mono'
import './index.css'

import RootLayout from './components/RootLayout.jsx'
import Home from './pages/Home.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import NotFound from './pages/NotFound.jsx'
import DrawingLibrary from './pages/DrawingLibrary.jsx'
import PrintSummary from './pages/PrintSummary.jsx'
import WorkshopIndex from './pages/WorkshopIndex.jsx'
import AirMotorPage from './pages/AirMotorPage.jsx'
import { experiences } from './data/experiences.js'

// Each project route shares the case study renderer and ProjectLayout shell.
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      ...experiences.map((project) => ({
        path: `project/${project.slug}`,
        element: <ProjectPage project={project} />,
      })),
      { path: 'misc', element: <WorkshopIndex /> },
      // Workshop subpage: explicit route, not an `experiences` entry (that array drives the gear teeth).
      { path: 'workshop/air-motor', element: <AirMotorPage /> },
      { path: 'drawings', element: <DrawingLibrary /> },
      { path: 'print', element: <PrintSummary /> },
      { path: 'summary', element: <Navigate to="/print" replace /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
