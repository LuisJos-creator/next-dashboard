import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const list = () => {
  const [name, setName] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cant, setCant] = useState("");
  const [prec, setPrec] = useState("");
  const [file, setFile] = useState(null); // Nuevo estado para la imagen
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("productos")
      .select("id, img, nombre, descripcion, cantidad, precio");
    if (error) console.error(error);
    else setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBorrar = async (id) => {
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) {
      console.error(error);
    } else {
      setData(data.filter((item) => item.id !== id));
    }
  };

  const handleAñadir = async () => {
    try {
      setUploading(true);
      let publicUrl = "";

      // 1. Subir imagen si existe
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("img") // Asegúrate que el bucket se llame "img"
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Obtener la URL pública
        const { data: urlData } = supabase.storage
          .from("img")
          .getPublicUrl(filePath);
        
        publicUrl = urlData.publicUrl;
      }

      // 3. Insertar en la base de datos
      const { error: dbError } = await supabase.from("productos").insert([
        {
          nombre: name,
          descripcion: descripcion,
          cantidad: cant,
          precio: prec,
          img: publicUrl, // Guardamos la URL aquí
        },
      ]);

      if (dbError) throw dbError;

      // Limpiar campos y refrescar
      alert("Producto añadido con éxito");
      setName("");
      setDescripcion("");
      setCant("");
      setPrec("");
      setFile(null);
      fetchData(); // Recargar la lista
      window.location.hash = ""; // Cerrar modal (si usas daisyUI anchor)

    } catch (error) {
      console.error("Error completo:", error.message);
      alert("Error al añadir: " + error.message);
    } finally {
      setUploading(false);
    }
  };

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
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.nombre}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs">Sin foto</div>
                  )}
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

      {/* Modal */}
      <div className="modal" role="dialog" id="my_modal_8">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Añadir producto</h3>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 mt-4">
            
            <label className="label">Imagen</label>
            <input 
              type="file" 
              className="file-input file-input-bordered w-full" 
              onChange={(e) => setFile(e.target.files[0])}
              accept="image/*"
            />

            <label className="label">Nombre</label>
            <input type="text" className="input input-bordered w-full" value={name} onChange={(e) => setName(e.target.value)} />

            <label className="label">Descripción</label>
            <input type="text" className="input input-bordered w-full" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="label">Cantidad</label>
                <input type="number" className="input input-bordered w-full" value={cant} onChange={(e) => setCant(e.target.value)} />
              </div>
              <div className="flex-1">
                <label className="label">Precio</label>
                <input type="number" className="input input-bordered w-full" value={prec} onChange={(e) => setPrec(e.target.value)} />
              </div>
            </div>
          </fieldset>
          
          <div className="modal-action">
            <button 
              className={`btn btn-success ${uploading ? 'loading' : ''}`} 
              onClick={handleAñadir}
              disabled={uploading}
            >
              {uploading ? 'Subiendo...' : 'Añadir'}
            </button>
            <a href="#" className="btn btn-error">Cancelar</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default list;