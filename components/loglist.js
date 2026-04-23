import React, { useState, useEffect } from 'react'
import { supabase } from "../utils/supabaseClient";

const LogList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeProducts = (productos) => {
    if (!productos) return [];
    if (Array.isArray(productos)) return productos;

    try {
      const parsed = JSON.parse(productos);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (err) {
      return [{ nombre: String(productos) }];
    }
  };

  const renderProduct = (product) => {
    if (!product) return null;

    const nombre = product.nombre || product.name || 'Item';
    const descripcion = product.descripcion || product.description || '';
    const cantidad = product.cantidad != null ? product.cantidad : '';
    const precio = product.precio != null ? product.precio : '';
    const imgSrc = product.img || product.image || product.url || '';

    return (
      <div className="flex gap-3 py-2 border-b border-base-200 last:border-b-0">
        <div className="flex-shrink-0">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={nombre}
              className="h-14 w-14 rounded object-cover"
            />
          ) : (
            <div className="h-14 w-14 rounded bg-base-200 flex items-center justify-center text-xs text-base-content/70">
              Sin imagen
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm">{nombre}</p>
          {descripcion ? (
            <p className="text-xs text-base-content/70">{descripcion}</p>
          ) : null}
          <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-base-content/70">
            {cantidad !== '' && <span>Cantidad: {cantidad}</span>}
            {precio !== '' && <span>Precio: {precio}</span>}
          </div>
        </div>
      </div>
    );
  };

  const fetchData = async () => {
    setLoading(true);
    const { data: registros, error } = await supabase
      .from("registro")
      .select("id, nombre_cliente, nombre_vendedor, fecha, cedula_del_cliente, telefono_del_cliente, condicion, productos")
      .order('id', { ascending: false });

    if (error) {
      console.error(error);
      setData([]);
    } else {
      setData((registros || []).map((item) => ({
        ...item,
        productos: normalizeProducts(item.productos),
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="table table-xs w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Fecha</th>
            <th>Cédula</th>
            <th>Teléfono</th>
            <th>Condición</th>
            <th>Productos</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center py-4">
                Cargando...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-4">
                No hay registros disponibles.
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const isIngreso = String(item.condicion).toLowerCase() === 'ingreso';
              return (
                <tr key={item.id}>
                  <th>{item.id}</th>
                  <td>{isIngreso ? '' : item.nombre_cliente}</td>
                  <td>{item.nombre_vendedor}</td>
                  <td>{item.fecha}</td>
                  <td>{isIngreso ? '' : item.cedula_del_cliente}</td>
                  <td>{isIngreso ? '' : item.telefono_del_cliente}</td>
                  <td>{item.condicion}</td>
                  <td>
                    {item.productos.length > 0 ? (
                      item.productos.map((product, index) => (
                        <div key={`${item.id}-${index}`}>{renderProduct(product)}</div>
                      ))
                    ) : (
                      <span>No hay productos</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LogList;
