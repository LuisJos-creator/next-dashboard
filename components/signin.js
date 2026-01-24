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
      console.log(data);
      setEmail("");
      setPassword("");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      <div>
        <fieldset className="fieldset rounded-box w-xs border p-4 m-9">
          <legend className="fieldset-legend text-center">Sign in</legend>

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

          <button className="btn bg-info-content mt-4" onClick={handleSignin}>
            Iniciar Sesión
          </button>
        </fieldset>
      </div>
    </>
  );
};
export default Signin;
