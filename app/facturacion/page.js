"use client";
import React, { useEffect, useState } from "react";
import Factucont from "@/components/factucont";
import { supabase } from "@/utils/supabaseClient"; // Importación directa
import { useRouter } from "next/navigation";

const facturacionPage = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Comprobar sesión inicial
    const getInitialSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      if (!currentSession) {
        router.push("/"); // Redirigir si no hay sesión
      } else {
        setSession(currentSession);
        setLoading(false);
      }
    };

    getInitialSession();

    // 2. Escuchar cambios (por si cierran sesión desde el navbar)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) router.push("/");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Mientras verifica, mostramos un estado de carga de daisyUI
  if (loading) {
    return (
      <div className="grid h-screen place-items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-4 grid-rows-6 gap-6 p-4">
      <div className="card card-xl shadow-sm border col-span-2 row-span-6 col-start-2">
        <div className="card-body center">
          <h2 className="card-title text-center block text-4xl">Facturacion</h2>
          <Factucont />
        </div>
      </div>
    </div>
  );
};

export default facturacionPage;
