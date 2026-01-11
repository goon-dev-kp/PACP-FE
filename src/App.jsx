import Header from "./Layout/Header";
import "./App.css";
import HomePage from "./Pages/HomePage";
import Footer from "./Layout/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CustomerLogin from "./Pages/CustomerLogin";
import MainLayout from "./Layout/MainLayout";
import ForgetPassword from "./Layout/ForgetPassword";
import Resetpassword from "./Layout/Resetpassword";
import Register from "./Layout/Register";
import ActiveAccount from "./Layout/ActiveAccount";
import AboutUs from "./Components/AboutUs/AboutUs";
import ListPet from "./Pages/ListPet";
import PetCreate from "./Pages/PetCreate";
import PetManagementPage from "./Pages/PetManagementPage";
import RequestManagementPage from "./Pages/RequestManagementPage";

import UserEmergencyManager from "./Pages/UserEmergencyManager";
import CallBackPaypal from "./Pages/CallBackPaypal";
import ThankYou from "./Pages/ThankYou";
import PaymentError from "./Pages/PaymentError";

import Dashboard from "./Layout/Dashboard";

import DonationListPage from "./Pages/DonationListPage";
import DonationDetailPage from "./Pages/DonationDetailPage";
import VendorMapPage from "./Pages/VendorMapPage";
import RescuePage from "./Pages/RescuePage";
import ProfilePage from "./Pages/ProfilePage";
import ReviewerManagementPage from "./Pages/ReviewerManagementPage";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />
          <Route
            path="/about-us"
            element={
              <MainLayout>
                <AboutUs />
              </MainLayout>
            }
          />
          <Route
            path="/map"
            element={
              <MainLayout>
                <VendorMapPage />
              </MainLayout>
            }
          />
          <Route
            path="/rescue"
            element={
              <MainLayout>
                <RescuePage />
              </MainLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            }
          />
          <Route
            path="/list-pet"
            element={
              <MainLayout>
                <ListPet />
              </MainLayout>
            }
          />
          <Route
            path="/create-pet"
            element={
              <MainLayout>
                <PetCreate />
              </MainLayout>
            }
          />
          
          <Route
            path="/manage-pet"
            element={
              <MainLayout>
                <PetManagementPage />
              </MainLayout>
            }
          />
          <Route
            path="/manage-request"
            element={
              <MainLayout>
                <RequestManagementPage />
              </MainLayout>
            }
          />
          <Route

            path="/manage-emergency"
            element={
              <MainLayout>
                <UserEmergencyManager />
              </MainLayout>
            }
          />
          <Route
            path="/CallBackPaypal"
            element={
              <MainLayout>
                <CallBackPaypal />
              </MainLayout>
            }
          />
           <Route
            path="/thank-you"
            element={
              <MainLayout>
                <ThankYou />
              </MainLayout>
            }
          />
          <Route
            path="/payment-error"
            element={
              <MainLayout>
                <PaymentError />

              </MainLayout>
            }
            />
            <Route
            path="/dashboard"
            element={
              <MainLayout>
                <Dashboard />

              </MainLayout>
            }
          />
          <Route
            path="/manage-donate"
            element={
              <MainLayout>
                <DonationListPage />

              </MainLayout>
            }
          />
          <Route
            path="/manage-reviewer"
            element={
              <MainLayout>
                <ReviewerManagementPage />

              </MainLayout>
            }
          />
          <Route path="/donations/:id" element={
            <MainLayout>
            <DonationDetailPage />
            </MainLayout>
            } />
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<Resetpassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/active-account" element={<ActiveAccount />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
