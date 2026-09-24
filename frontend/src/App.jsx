import React from 'react';
import Navbar from './components/Common/Navbar.jsx';
import MarqueeTicker from './components/Common/MarqueeTicker.jsx';
import Footer from './components/Common/Footer.jsx';
import AppRoutes from './AppRoutes.jsx';
import { RoleProvider } from './context/RoleContext.jsx';

function App() {
  return (
    <RoleProvider>
      <div className="min-h-screen flex flex-col bg-warm selection:bg-sage-200 selection:text-forest">
        <Navbar />
        <MarqueeTicker />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </RoleProvider>
  );
}

export default App;
