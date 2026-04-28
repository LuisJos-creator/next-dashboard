"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Buttonlogout from "./buttonlogout";
import { supabase } from "@/utils/supabaseClient";

const Navbar = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription?.unsubscribe?.();
  }, []);

  if (!session) {
    return null;
  }

  return (
    <div className="navbar sticky top-0 z-50 border-b border-base-200/70 bg-base-100/90 backdrop-blur-xl shadow-sm">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost normal-case text-xl tracking-tight">
          Mi Dashboard
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>
            <Link href="/inventario">Inventario</Link>
          </li>
          <li>
            <Link href="/registro">Registro</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end flex items-center gap-3">
        <span className="hidden sm:inline text-sm text-base-content/70">
          Navegación rápida
        </span>
        <Buttonlogout />
      </div>
    </div>
  );
};

export default Navbar;
