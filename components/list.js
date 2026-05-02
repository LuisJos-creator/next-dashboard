import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { PDFDownloadLink } from '@react-pdf/renderer';
import FacturaPDF from "./factupdf";

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

<input type="text" placeholder="n° de cedula del cliente" className="input input-bordered w-full" value={numcedulaCLI} onChange={(e) => setNumCedulaCLI(e.target.value)} />

<input type="text" placeholder="telefono del cliente" className="input input-bordered w-full" value={telefonoCLI} onChange={(e) => setTelefonoCLI(e.target.value)} />



</div>

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
  className="btn btn-success"
  onClick={async () => {
    await handleFacturar();
  }}
>
  {({ loading }) => (loading ? 'Generando...' : 'Descargar Factura')}
</PDFDownloadLink>

<button className="btn btn-ghost ml-2" onClick={() => { resetForm(); }}>
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