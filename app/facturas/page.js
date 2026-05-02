'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import Loglist from '@/components/loglist';
import { supabase } from '@/utils/supabaseClient'; // Importación directa
import { useRouter } from 'next/navigation';

const facturasPage = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Comprobar sesión inicial
    const getInitialSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) {
        router.push("/"); // Redirigir si no hay sesión
      } else {
        setSession(currentSession);
        setLoading(false);
      }
    };

    getInitialSession();

    // 2. Escuchar cambios (por si cierran sesión desde el navbar)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
    <div>
      <Navbar />
      <div className="p-4">
        <div>
          <h1 className="text-2xl font-bold mb-4 text-center">Facturas</h1>
        </div>

        <Loglist />
      </div>
    </div>
  );
};

export default facturasPage;