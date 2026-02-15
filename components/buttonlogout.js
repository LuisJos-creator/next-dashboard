"use client";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/navigation"; // Importar router

const buttonlogout = () => {
  const router = useRouter(); // Inicializar router

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Redirigir al usuario al Home inmediatamente
      router.push("/");
      alert("Sesión cerrada.");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <button className="btn bg-error-content" onClick={handleLogout}>
      Cerrar Sesión
    </button>
  );
};

export default buttonlogout;