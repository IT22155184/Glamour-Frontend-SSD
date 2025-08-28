import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeRedirect from "./components/HomeRedirect";
import Home from "./pages/onlineStore/Home.jsx";
import ProductPage from "./pages/onlineStore/ProductPage.jsx";
import Catalogue from "./pages/onlineStore/Catalogue.jsx";
import StoreManagerDashboard from "./pages/onlineStoreManager/StoreManagerDashboard.jsx";
import StoreItemsList from "./pages/onlineStoreManager/StoreItemsList.jsx";
import Cart from "./pages/onlineStore/Cart.jsx";
import OngoingOrders from "./pages/onlineStoreManager/OngoingOrders.jsx";
import CompletedOrders from "./pages/onlineStoreManager/CompletedOrders.jsx";
import CanceledOrders from "./pages/onlineStoreManager/CanceledOrders.jsx";
import StoreManagerDB from "./pages/onlineStoreManager/StoreManagerDashboard.jsx";
import ViewOrderReport from "./pages/onlineStoreManager/ViewOrderReport.jsx";
import AddBodyMeasurement from "./pages/model/AddBodyMeasurements.jsx";
import EditBodyMeasurement from "./pages/model/EditBodyMeasurement.jsx";
import DeleteBodyMeasurement from "./pages/model/DeleteBodyMeasurement.jsx";
import ViewBodyMeasurement from "./pages/model/ViewBodyMeasurement.jsx";
import MeasurementsTable from "./pages/model/MeasurementsTable.jsx";
import Register from "./pages/users/Register.jsx";
import Login from "./pages/users/LoginUser.jsx";
import CusProfile from "./pages/users/CusProfile.jsx";
import EditCusProfile from "./pages/users/EditCusProfile.jsx";
import EmpRegister from "./pages/users/EmpRegister.jsx";
import EmpLogin from "./pages/users/EmpLogin.jsx";
import EmpProfile from "./pages/users/EmpProfile.jsx";
import EditEmpProfile from "./pages/users/EditEmpProfile.jsx";
import ModelSizeReport from "./pages/model/ModelSizesReport.jsx";
import Checkout from "./pages/onlineStore/Checkout.jsx";
import CusAddresses from "./pages/onlineStore/CusAddresses.jsx";
import Order from "./pages/onlineStore/Order.jsx";
import Payment from "./pages/onlineStore/Payment.jsx";
import PaymentSuccessReport from "./pages/onlineStore/PaymentSuccessReport.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<HomeRedirect />} />
        <Route
          path="/HomeCus"
          element={
            <ProtectedRoute requiredRole="customer">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/ProductPage/:id" element={<ProductPage />} />
        <Route path="/Catalogue" element={<Catalogue />} />
        <Route
          path="/Store_Manager"
          element={
            <ProtectedRoute requiredRole="employee">
              <StoreManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/StoreItemsList"
          element={
            <ProtectedRoute requiredRole="employee">
              <StoreItemsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Cart"
          element={
            <ProtectedRoute requiredRole="customer">
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/OngoingOrders"
          element={
            <ProtectedRoute requiredRole="employee">
              <OngoingOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/CompletedOrders"
          element={
            <ProtectedRoute requiredRole="employee">
              <CompletedOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/CanceledOrders"
          element={
            <ProtectedRoute requiredRole="employee">
              <CanceledOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Store_Manager"
          element={
            <ProtectedRoute requiredRole="employee">
              <StoreManagerDB />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ViewOrderReport"
          element={
            <ProtectedRoute requiredRole="employee">
              <ViewOrderReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/measurements/create"
          element={
            <ProtectedRoute>
              <AddBodyMeasurement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/measurements/edit/:id"
          element={
            <ProtectedRoute>
              <EditBodyMeasurement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/measurements/delete/:id"
          element={
            <ProtectedRoute>
              <DeleteBodyMeasurement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/measurements/view/:id"
          element={
            <ProtectedRoute>
              <ViewBodyMeasurement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/measurements/view"
          element={
            <ProtectedRoute requiredRole="employee">
              <MeasurementsTable />
            </ProtectedRoute>
          }
        />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route
          path="/cusProfile"
          element={
            <ProtectedRoute requiredRole="customer">
              <CusProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EditCusProfile"
          element={
            <ProtectedRoute requiredRole="customer">
              <EditCusProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/EmpRegister" element={<EmpRegister />} />
        <Route path="/EmpLogin" element={<EmpLogin />} />
        <Route
          path="/EmpProfile"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmpProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EditEmpProfile"
          element={
            <ProtectedRoute requiredRole="employee">
              <EditEmpProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ModelSizesReport"
          element={
            <ProtectedRoute requiredRole="employee">
              <ModelSizeReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Checkout"
          element={
            <ProtectedRoute requiredRole="customer">
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Addresses"
          element={
            <ProtectedRoute requiredRole="customer">
              <CusAddresses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Orders"
          element={
            <ProtectedRoute requiredRole="customer">
              <Order />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Payment"
          element={
            <ProtectedRoute requiredRole="customer">
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/SuccessPayment/:id"
          element={
            <ProtectedRoute requiredRole="customer">
              <PaymentSuccessReport />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
