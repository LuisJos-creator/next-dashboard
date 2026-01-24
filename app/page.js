"use client";
import Image from "next/image";
import Signin from "@/components/signin";
import Signup from "@/components/signup";
import { supabase } from "../utils/supabaseClient";
import React, { useEffect, useState } from "react";
import Dashboard from "@/components/dashboard";

export default function Home() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } = {} } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  if (session) {
    return <Dashboard />;
  }

  return (
    <>
      {/* 
      <Image
        src="/img/random-logo-png-transparent.png"
        alt="random-logo-svg-vector"
        width={300}
        height={300}
        className="flex justify-center"
      /> 
      */}

      <div className="flex justify-center mt-65 gap-5">
        <Signup />
        <div className="divider divider-horizontal border-base-content">Sign In or Up</div>
        <Signin />
      </div>
    </>
  );
}
