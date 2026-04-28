"use client";
import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      alert("Cuenta iniciada.");
      setEmail("");
      setPassword("");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-[2rem] border border-base-200/70 bg-base-100/95 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="mb-6 space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">Bienvenido</p>
        <h2 className="text-2xl font-semibold">Iniciar sesión</h2>
        <p className="text-sm text-base-content/70">
          Ingresa tus credenciales para acceder al panel de control.
        </p>
      </div>
      <div className="space-y-4">
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
        <button className="btn btn-secondary w-full" onClick={handleSignin}>
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

export default Signin;
