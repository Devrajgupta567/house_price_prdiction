import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticleBackdrop from "../components/ParticleBackdrop";

export default function PublicLayout() {
  return (
    <>
      <ParticleBackdrop />
      <Navbar />
      <main style={{ position: "relative", zIndex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
