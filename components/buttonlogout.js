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
    <button className="btn btn-error" onClick={handleLogout}>
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
      Cerrar Sesión
    </button>
  );
};

export default buttonlogout;