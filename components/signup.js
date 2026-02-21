"use client";
import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleSignUp = async () => {
    try {
      // pasar email/password en el primer arg y user_metadata en el segundo
      const { data, error } = await supabase.auth.signUp(
        { email, password },
        { data: { display_name: displayName } }
      );

      if (error) throw error;

      const user = data?.user ?? null;

      // Crear/actualizar fila en la tabla "profiles" si el usuario ya está disponible
      if (user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: user.id,
         name: displayName,
        });
        if (profileError) throw profileError;
        alert("Cuenta creada.");
      } else {
        // En algunos flujos (confirmación por email) el usuario no se devuelve inmediatamente
        alert("Registrado. Revisa tu correo y confirma tu cuenta para completar el perfil.");
      }
      setDisplayName("");
      setEmail("");
      setPassword("");
    } catch (e) {
      alert(e.message || e);
    }
  };

  return (
    <>
      <div>
        <fieldset className="fieldset rounded-box w-xs border p-4 m-9">
          <legend className="fieldset-legend text-center">Sign Up</legend>

          <label className="label">Display Name</label>
          <input
            type="text"
            className="input"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn bg-error-content mt-4" onClick={handleSignUp}>
            Registrarse
          </button>
        </fieldset>
      </div>
    </>
  );
};

export default Signup;
