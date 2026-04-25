import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { PDFDownloadLink } from '@react-pdf/renderer';
import FacturaPDF from "./facturacion";

const list = () => {
  const [name, setName] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cant, setCant] = useState("");
  const [prec, setPrec] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState({});
  const [sellQuantities, setSellQuantities] = useState({});
  const [nombreCLI, setNombreCLI] = useState("");
  const [nombreVEN, setNombreVEN] = useState("");
  const [fecha, setFecha] = useState(new Date().toLocaleDateString());
  const [numcedulaCLI, setNumCedulaCLI] = useState("");
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
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      console.error("No user logged in");
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }
    if (data && data.name) {
      setNombreVEN(data.name);
    }
  };

  useEffect(() => {
    fetchData();
    fetchNombre();
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
    setFecha(new Date().toLocaleDateString());
    setNumCedulaCLI("");
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

  const toggleSelectProduct = (item) => {
    const isSelected = !!selectedProductIds[item.id];
    const newSelection = { ...selectedProductIds };
    const newQuantities = { ...sellQuantities };

    if (isSelected) {
      delete newSelection[item.id];
      delete newQuantities[item.id];
    } else {
      newSelection[item.id] = true;
      newQuantities[item.id] = 1;
    }

    setSelectedProductIds(newSelection);
    setSellQuantities(newQuantities);
  };

  const handleFacturar = async () => {
    await fetchNombre();
    const registroOk = await handleRegistrar();
    if (!registroOk) return;
    await handleConfirmarVenta();
  };

const handleRegistrar = async () => {
    try {
      if (productosParaFactura.length === 0) {
        alert('Selecciona al menos un producto para registrar la venta.');
        return false;
      }
      setUploading(true);
      const { error } = await supabase
        .from("registro")
        .insert([{
          nombre_cliente: nombreCLI || null,
          nombre_vendedor: nombreVEN,
          fecha: fecha,
          cedula_del_cliente: numcedulaCLI ? numcedulaCLI : null,
          telefono_del_cliente: telefonoCLI ? telefonoCLI : null,
          productos: JSON.stringify(productosParaFactura), // Guardamos como JSON para mantener la estructura
          condicion: "Venta realizada" // Puedes personalizar esto según tus necesidades
        }]);

      if (error) throw error;
      alert("Registro guardado");
      return true;
    } catch (error) {
      alert("Error: " + error.message);
      return false;
    } finally {
      setUploading(false);
    }
  };


  const handleConfirmarVenta = async () => {
    const selectedProducts = data.filter((item) => selectedProductIds[item.id]);
    if (!selectedProducts.length) {
      alert('Selecciona al menos un producto para facturar.');
      return;
    }

    try {
      setUploading(true);

      for (const item of selectedProducts) {
        const qtyToSell = Number(sellQuantities[item.id] || 1);

        if (qtyToSell <= 0) {
          throw new Error(`Cantidad inválida para ${item.nombre}`);
        }

        if (qtyToSell > item.cantidad) {
          throw new Error(`No hay stock suficiente para ${item.nombre}`);
        }

        const newStock = item.cantidad - qtyToSell;

        if (newStock <= 0) {
          const { error } = await supabase.from('productos').delete().eq('id', item.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('productos').update({ cantidad: newStock }).eq('id', item.id);
          if (error) throw error;
        }
      }

      alert('Venta registrada y stock actualizado.');
      setSelectedProductIds({});
      setSellQuantities({});
      fetchData();
      resetForm();
    } catch (error) {
      alert('Error al facturar: ' + (error.message || error));
    } finally {
      setUploading(false);
    }
  };

  const productosParaFactura = data
    .filter((item) => selectedProductIds[item.id])
    .map((item) => ({
      ...item,
      cantidad: Number(sellQuantities[item.id] || 1),
    }));


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

      const cantidadValue = Number(cant);
      const precioValue = Number(prec);
      const productoData = {
        nombre: name,
        descripcion: descripcion,
        cantidad: Number.isNaN(cantidadValue) ? 0 : cantidadValue,
        precio: Number.isNaN(precioValue) ? 0 : precioValue,
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

        const registroData = {
          nombre_cliente: null,
          nombre_vendedor: nombreVEN,
          fecha,
          cedula_del_cliente: null,
          telefono_del_cliente: null,
          productos: JSON.stringify([productoData]),
          condicion: "Ingreso",
        };

        const { error: registroError } = await supabase
          .from("registro")
          .insert([registroData]);

        if (registroError) throw registroError;

        alert("Producto añadido y registro de ingreso creado");
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
              <th>Sel</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio $</th>
              <th>Cantidad a vender</th>
              <th>
                <a href="#my_modal_8" className="btn btn-sm btn-success m-1" onClick={() => setEditId(null)}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                  Añadir
                </a>

                <a href="#my_modal_9" className="btn btn-sm btn-success">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M856-390 570-104q-12 12-27 18t-30 6q-15 0-30-6t-27-18L103-457q-11-11-17-25.5T80-513v-287q0-33 23.5-56.5T160-880h287q16 0 31 6.5t26 17.5l352 353q12 12 17.5 27t5.5 30q0 15-5.5 29.5T856-390ZM513-160l286-286-353-354H160v286l353 354ZM260-640q25 0 42.5-17.5T320-700q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640Zm220 160Z"/></svg>
                  Vender
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={!!selectedProductIds[item.id]}
                    onChange={() => toggleSelectProduct(item)}
                  />
                </td>
                <td>
                  <img src={item.img || "https://via.placeholder.com/150"} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="font-bold">{item.nombre}</td>
                <td>{item.descripcion}</td>
                <td>{item.cantidad === 0 ? "No Stock" : item.cantidad}</td>
                <td>${item.precio}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max={item.cantidad}
                    value={selectedProductIds[item.id] ? sellQuantities[item.id] : 1}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      setSellQuantities((prev) => ({ ...prev, [item.id]: qty }));
                    }}
                    disabled={!selectedProductIds[item.id]}
                    className="input input-xs w-20"
                  />
                </td>
                <td>
                  <a href="#my_modal_8" className="btn btn-sm btn-primary m-1" onClick={() => prepararEdicion(item)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                    Editar
                  </a>
                  <button className="btn btn-sm btn-error" onClick={() => handleBorrar(item.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg>
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

<input type="text" placeholder="n° de cedula del cliente" className="input input-bordered w-full" value={numcedulaCLI} onChange={(e) => setNumCedulaCLI(e.target.value)} />

<input type="text" placeholder="telefono del cliente" className="input input-bordered w-full" value={telefonoCLI} onChange={(e) => setTelefonoCLI(e.target.value)} />



</div>
<div className="btn btn-success">
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M120-80v-800l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v800l-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60Zm120-200h480v-80H240v80Zm0-160h480v-80H240v80Zm0-160h480v-80H240v80Zm-40 404h560v-568H200v568Zm0-568v568-568Z"/></svg>
<PDFDownloadLink
  document={<FacturaPDF
    nombreCliente={nombreCLI}
    nombreVendedor={nombreVEN}
    fecha={fecha}
    numCedula={numcedulaCLI}
    telefono={telefonoCLI}
    productos={productosParaFactura}
  />}
  fileName="factura.pdf"
  onClick={async () => {
    await handleFacturar();
  }}
>
  {({ loading }) => (loading ? 'Generando...' : 'Descargar Factura')}
</PDFDownloadLink>
</div>
<button className="btn btn-ghost ml-2" onClick={() => { resetForm(); }}>
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffd6a7"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
  Cancelar
</button>

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
              <input type="number" placeholder="Precio $" className="input input-bordered w-full" value={prec} onChange={(e) => setPrec(e.target.value)} />
            </div>
          </div>

          <div className="modal-action">
            <button className={`btn btn-success ${uploading ? 'loading' : ''}`} onClick={handleGuardar} disabled={uploading}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM565-275q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/></svg>
              {uploading ? 'Guardando...' : (editId ? 'Actualizar' : 'Guardar')}
            </button>
            <button className="btn btn-ghost" onClick={resetForm}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffd6a7"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>Cancelar</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default list;