import React, { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

const list = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('productos')
        .select('nombre, cantidad, precio, categoria')
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
        <th>Nombre</th>
        <th>Cantidad</th>
        <th>Precio</th>
        <th>Categoría</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item, index) => (
        <tr key={index}>
          <td>{item.nombre}</td>
          <td>{item.cantidad}</td>
          <td>${item.precio}</td>
          <td>{item.categoria}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </>
  )
}

export default list
