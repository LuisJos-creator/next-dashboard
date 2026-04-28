"use client";
import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp(
        { email, password },
        { data: { display_name: displayName } }
      );

      if (error) throw error;

      const user = data?.user ?? null;

      if (user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: user.id,
          name: displayName,
        });
        if (profileError) throw profileError;
        alert("Cuenta creada.");
      } else {
        alert("Registrado. Revisa tu correo y confirma tu cuenta.");
      }

      setDisplayName("");
      setEmail("");
      setPassword("");
    } catch (e) {
      alert(e.message || e);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-[2rem] border border-base-200/70 bg-base-100/95 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="mb-6 space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">Nuevo usuario</p>
        <h2 className="text-2xl font-semibold">Crear cuenta</h2>
        <p className="text-sm text-base-content/70">
          Completa los datos para comenzar a usar el panel de inventario.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="label">Nombre</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Nombre"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="label">Email</label>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="label">Contraseña</label>
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-full" onClick={handleSignUp}>
          Registrarse
        </button>
      </div>
    </div>
  );
};

export default Signup;
