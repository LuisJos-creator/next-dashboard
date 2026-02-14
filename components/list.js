import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const list = () => {
  const [name, setName] = useState(null)
  const [data, setData] = useState([]);

  const handleBorrar = async (id) => {
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) {
      console.error(error);
    } else {
      setData(data.filter((item) => item.id !== id));
    }
  };

  const handleAñadir = async () => {
    /*const { error } = await supabase
    .from("productos")
    .delete()
    .eq("id", id);
    if (error) {
      console.error(error);*/
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("id, img, nombre, descripcion, cantidad, precio");
      if (error) {
        console.error(error);
      } else {
        setData(data);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>
                <a href="#my_modal_8" className="btn btn-sm btn-success">
                  Añadir
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="text-base">
                  <img
                    src={item.img}
                    alt={item.nombre}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="text-base">{item.nombre}</td>
                <td className="text-base">{item.descripcion}</td>
                <td className="text-base">
                  {item.cantidad > 0 ? item.cantidad : "No Stock"}
                </td>
                <td className="text-base">${item.precio}</td>
                <td>
                  <button className="btn btn-sm btn-primary m-1">Editar</button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleBorrar(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="modal" role="dialog" id="my_modal_8">
        <h3 className="text-lg font-bold">Añadir producto</h3>

        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <label className="label">Title</label>
          <input type="text" className="input" value={name} onChange={(n) => setName(n.target.value)} placeholder="My awesome page" />

          <label className="label">Slug</label>
          <input type="text" className="input" placeholder="my-awesome-page" />

          <label className="label">Author</label>
          <input type="text" className="input" placeholder="Name" />
        </fieldset>
        <div className="modal-action">
          <a href="#" className="btn btn-success" onClick={handleAñadir()}>
            Añadir
          </a>
          <a href="#" className="btn btn-error">
            Cancelar
          </a>
        </div>
      </div>
    </>
  );
};

export default list;
