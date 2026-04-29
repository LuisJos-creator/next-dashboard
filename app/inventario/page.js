'use client';
import React, { Suspense } from 'react';
// Importamos el componente donde moviste toda la lógica
import Continven from '@/components/continven'; 

export default function InventarioPage() {
    return (
        /* El Suspense envuelve a tu componente. 
           Mientras Next.js prepara los parámetros de la URL, 
           mostrará el spinner de carga.
        */
        <Suspense fallback={
            <div className="grid h-screen place-items-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        }>
            <Continven />
        </Suspense>
    );
}