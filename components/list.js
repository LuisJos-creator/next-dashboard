import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import FacturaPDF from "./facturacion";

const list = () => {
  const [name, setName] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cant, setCant] = useState("");
  const [prec, setPrec] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState([]);
  const [nombreCLI, setNombreCLI] = useState("");
  const [nombreVEN, setNombreVEN] = useState("");
  const [fecha, setFecha] = useState(new Date().toLocaleDateString());
  const [numcedula, setNumCedula] = useState("");
  const [telefonoCLI, setTelefonoCLI] = useState("");
  // NUEVO: Estado para saber si estamos editando
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("productos")
      .select("id, img, nombre, descripcion, cantidad, precio")
      .order('id', { ascending: false }); // Opcional: ver los nuevos primero
    if (error) console.error(error);
    else setData(data);
  };

  const fetchNombre = async () => {
    const { nombre, error } = await supabase
      .from("profiles")
      .select("nombre")
    if (error) console.error(error);
    else setNombreVEN(nombre);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Función para limpiar campos y cerrar modal
  const resetForm = () => {
    setName("");
    setDescripcion("");
    setCant("");
    setPrec("");
    setFile(null);
    setEditId(null);
    setNombreCLI("");
    setNombreVEN("");
    setFecha(new Date().toLocaleDateString());
    setNumCedula("");
    setTelefonoCLI("");

    window.location.hash = ""; 
  };

  // Cargar datos en el modal para editar
  const prepararEdicion = (item) => {
    setEditId(item.id);
    setName(item.nombre);
    setDescripcion(item.descripcion);
    setCant(item.cantidad);
    setPrec(item.precio);
    // El input file no se puede llenar por seguridad, 
    // se queda null a menos que el usuario elija una foto nueva.
  };

  const handleBorrar = async (id) => {
    if(!confirm("¿Estás seguro de eliminar este producto?")) return;
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) console.error(error);
    else fetchData();
  };

  const handleFacturar = async () => {
    fetchNombre();
    console.log("Nombre del vendedor:", nombreVEN);
     
    

  }

  const handleGuardar = async () => {
    try {
      setUploading(true);
      
      // Buscamos la URL de imagen actual si estamos editando
      let currentImageUrl = editId ? data.find(p => p.id === editId)?.img : "";

      // 1. Subir nueva imagen solo si el usuario seleccionó una
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("img")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("img").getPublicUrl(filePath);
        currentImageUrl = urlData.publicUrl;
      }

      const productoData = {
        nombre: name,
        descripcion: descripcion,
        cantidad: cant,
        precio: prec,
        img: currentImageUrl,
      };

      if (editId) {
        // 2. MODO EDICIÓN
        const { error: updateError } = await supabase
          .from("productos")
          .update(productoData)
          .eq("id", editId);
        
        if (updateError) throw updateError;
        alert("Producto actualizado");
      } else {
        // 3. MODO AÑADIR
        const { error: insertError } = await supabase
          .from("productos")
          .insert([productoData]);

        if (insertError) throw insertError;
        alert("Producto añadido");
      }

      resetForm();
      fetchData();

    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto p-4">
        <table className="table table-xs">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>
                <a href="#my_modal_8" className="btn btn-sm btn-success m-1" onClick={() => setEditId(null)}>
                  Añadir
                </a>

                <a href="#my_modal_9" className="btn btn-sm btn-success">
                  Vender
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>
                  <img src={item.img || "https://via.placeholder.com/150"} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="font-bold">{item.nombre}</td>
                <td>{item.descripcion}</td>
                <td>{item.cantidad === 0 ? "No Stock" : item.cantidad}</td>
                <td>${item.precio}</td>
                <td>
                  <a href="#my_modal_8" className="btn btn-sm btn-primary m-1" onClick={() => prepararEdicion(item)}>
                    Editar
                  </a>
                  <button className="btn btn-sm btn-error" onClick={() => handleBorrar(item.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

 <div className="modal" role="dialog" id="my_modal_9">
 <div className="modal-box">
<h3 className="text-lg font-bold">Vender Producto</h3>

<div className="py-4 space-y-3">

<input type="text" placeholder="Nombre del cliente" className="input input-bordered w-full" value={nombreCLI} onChange={(e) => setNombreCLI(e.target.value)} />

<input type="text" placeholder="n° de cedula del cliente" className="input input-bordered w-full" value={numcedula} onChange={(e) => setNumCedula(e.target.value)} />

<input type="text" placeholder="telefono del cliente" className="input input-bordered w-full" value={telefonoCLI} onChange={(e) => setTelefonoCLI(e.target.value)} />



</div>

<button className="btn btn-success" onClick={handleFacturar}>Facturar</button>

<button className="btn btn-ghost"  onClick={() => {
resetForm();
}}>Cancelar</button>

</div>
</div>      

      {/* Modal Unificado */}
      <div className="modal" role="dialog" id="my_modal_8">
        <div className="modal-box">
          <h3 className="text-lg font-bold">{editId ? "Editar Producto" : "Añadir Producto"}</h3>
          
          <div className="py-4 space-y-3">
            <div className="form-control">
              <label className="label">Imagen {editId && "(dejar vacío para mantener actual)"}</label>
              <input type="file" className="file-input file-input-bordered w-full" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
            </div>

            <input type="text" placeholder="Nombre" className="input input-bordered w-full" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Descripción" className="input input-bordered w-full" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            
            <div className="flex gap-2">
              <input type="number" placeholder="Cantidad" className="input input-bordered w-full" value={cant} onChange={(e) => setCant(e.target.value)} />
              <input type="number" placeholder="Precio" className="input input-bordered w-full" value={prec} onChange={(e) => setPrec(e.target.value)} />
            </div>
          </div>

          <div className="modal-action">
            <button className={`btn btn-success ${uploading ? 'loading' : ''}`} onClick={handleGuardar} disabled={uploading}>
              {uploading ? 'Guardando...' : (editId ? 'Actualizar' : 'Guardar')}
            </button>
            <button className="btn btn-ghost" onClick={resetForm}>Cancelar</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default list;