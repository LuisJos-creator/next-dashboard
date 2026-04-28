"use client";
import Signin from "@/components/signin";
import Signup from "@/components/signup";
import { supabase } from "../utils/supabaseClient";
import React, { useEffect, useState, createContext } from "react";
import Dashboard from "@/components/dashboard";

export const sessionContext = createContext(null);

export default function Home() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } = {} } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  if (session) {
    return <Dashboard />;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(16,185,129,0.12),_transparent_22%)] px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="hero-panel overflow-hidden rounded-[2rem] border border-base-300/50 bg-base-100/95 p-10 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                Panel intuitivo de inventario
              </span>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Administra tu inventario con claridad y estilo.
                </h1>
                <p className="max-w-2xl text-base-content/75 leading-8">
                  Controla productos, registra ventas y visualiza métricas importantes desde un dashboard limpio y moderno.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-base-200/70 bg-base-200/75 p-5 text-sm">
                  <p className="font-semibold">Registro rápido</p>
                  <p className="text-base-content/70">Agrega o edita productos y controla el stock en segundos.</p>
                </div>
                <div className="rounded-3xl border border-base-200/70 bg-base-200/75 p-5 text-sm">
                  <p className="font-semibold">Dashboard visual</p>
                  <p className="text-base-content/70">Métricas claras, gráficas y tablas accesibles para tomar decisiones rápidas.</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-base-200/70 bg-slate-950/10 p-6 shadow-lg">
              <div className="space-y-4 text-center">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-600">Accede al panel</p>
                <h2 className="text-2xl font-semibold">Inicia sesión o crea tu cuenta</h2>
                <p className="text-sm text-base-content/70">
                  Si ya tienes cuenta, ingresa rápido. Si no, crea tu perfil y accede a todas las funciones.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <Signup />
          <Signin />
        </div>
      </div>
    </main>
  );
}
