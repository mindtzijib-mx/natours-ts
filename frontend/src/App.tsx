import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import {
  Home,
  TourDetail,
  Login,
  Signup,
  Account,
  Error,
  LoadingSpinner,
} from "./utils/lazyComponents.tsx";
import "./styles/globals.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route
              path="/tour/:slug"
              element={
                <>
                  <Header />
                  <Suspense fallback={<LoadingSpinner />}>
                    <TourDetail />
                  </Suspense>
                  <Footer />
                </>
              }
            />
            <Route
              path="*"
              element={
                <>
                  <Header />
                  <main className="main">
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route
                          path="/account"
                          element={
                            <ProtectedRoute>
                              <Account />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="/error" element={<Error />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
