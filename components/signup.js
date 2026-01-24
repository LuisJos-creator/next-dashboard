"use client";
import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      alert("Cuenta creada.");
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
          <legend className="fieldset-legend text-center">Sign Up</legend>

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
