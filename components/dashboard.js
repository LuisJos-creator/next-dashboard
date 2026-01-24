import { supabase } from "../utils/supabaseClient";

const dashboard = () => {
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
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1>Dashboard</h1>
        <button className="btn bg-error-content mt-4" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </>
  );
};

export default dashboard;
