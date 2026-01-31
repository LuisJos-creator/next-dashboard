import React, { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

const list = () => {
  const [data, setData] = useState([])


const handleBorrar = async (id) => {
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id)
    if (error) {
      console.error(error)
    } else {
      setData(data.filter(item => item.id !== id))
    }
  }

const handleAñadir = async () => {
  


}



  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('productos')
        .select('id, img, nombre, descripcion, cantidad, precio')
      if (error) {
        console.error(error)
      } else {
        setData(data)
      }
    }
    fetchData()
  }, [])

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
        <th><button className="btn btn-sm btn-success" >Añadir</button></th>
      </tr>
    </thead>
    <tbody>
      {data.map((item, index) => (
        <tr key={index}>
          <td className='text-base'><img src={item.img} alt={item.nombre} className="w-16 h-16 object-cover rounded" /></td>
          <td className='text-base'>{item.nombre}</td>
          <td className='text-base'>{item.descripcion}</td>
          <td className='text-base'>{item.cantidad > 0 ? item.cantidad : "No Stock"}</td>
          <td className='text-base'>${item.precio}</td>
          <td><button className="btn btn-sm btn-primary m-1">Editar</button><button className="btn btn-sm btn-error" onClick={() => handleBorrar(item.id)}>Eliminar</button></td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </>
  )
}

export default list
