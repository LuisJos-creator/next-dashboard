import { supabase } from "../utils/supabaseClient";

const buttonlogout = () => {
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      alert("Sesión cerrada.");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      <button className="btn bg-error-content" onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </>
  );
};

export default buttonlogout;
