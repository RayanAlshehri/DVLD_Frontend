import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { UserProvider } from './UserContext.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage.jsx'
import NavBar from './NavBar/NavBar.jsx';
import PersonsList from './Persons/PersonsList/PersonsList.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import UsersList from './Users/UsersList/UsersList.jsx';
import LocalLicenseApplication from './Applications/LocalDrivingLicenseApplication/LocalDrivingLicenseApplication.jsx';
import ApplicationList from './Applications/ApplicationsList/ApplicationsList.jsx';
import ServicesList from './Manage/ServicesList/ServicesList.jsx';
import TestTypesList from './Manage/TestTypesList/TestTypesList.jsx';
import LicenseClassesList from './Manage/LicenseClassesList/LicenseClassesList.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/app",
        element: <NavBar showNavLinks={true} />,
        children: [
          {
            path: "persons",
            element: <PersonsList />,
          },
          {
            path: "users",
            element: <UsersList />,
          },
          {
            path: "applications/local-license-application",
            element: <LocalLicenseApplication key="add" />
          },
          {
            path: "applications/local-license-application/:localLicenseApplicationId",
            element: <LocalLicenseApplication key="update" />
          },
          {
            path: "applications/manage-application",
            element: <ApplicationList />
          },
          {
            path: "manage/services",
            element: <ServicesList />
          },
          {
            path: "manage/test-types",
            element: <TestTypesList />
          },
          {
            path: "manage/license-classes",
            element: <LicenseClassesList />
          }
        ]
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>,
)
