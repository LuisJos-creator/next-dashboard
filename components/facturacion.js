import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  headerContainer: {
    marginBottom: 16,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#4a90e2',
    borderBottomStyle: 'solid',
    paddingBottom: 8,
  },
  header: { fontSize: 24, fontWeight: 'bold', color: '#003366' },
  infoContainer: { marginTop: 10, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between' },
  block: { width: '48%' },
  blockTitle: { fontSize: 11, fontWeight: 'bold', marginBottom: 4, color: '#2a2a2a' },
  fieldRow: { flexDirection: 'row', marginBottom: 4 },
  label: { width: '30%', fontWeight: 'bold', color: '#444' },
  value: { flex: 1, color: '#222' },
  productsSection: { marginTop: 12, marginBottom: 10 },
  productsHeader: { fontSize: 12, fontWeight: 'bold', marginBottom: 6, color: '#2a2a2a' },
  productsTable: { width: '100%', borderWidth: 1, borderColor: '#ddd', borderStyle: 'solid' },
  productsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', borderBottomStyle: 'solid', paddingVertical: 6 },
  productCell: { paddingHorizontal: 4, color: '#222' },
  productHeaderCell: { fontWeight: 'bold', color: '#2a2a2a' },
  productId: { width: '15%' },
  productName: { width: '45%' },
  productQty: { width: '15%' },
  productPrice: { width: '15%' },
  totalContainer: { marginTop: 24, padding: 14, borderTopWidth: 1, borderTopColor: '#ddd', borderTopStyle: 'solid', backgroundColor: '#f7faff' },
  totalText: { fontSize: 14, fontWeight: 'bold', color: '#0a59ad' },
});

const FacturaPDF = ({ nombreCliente, nombreVendedor, fecha, numCedula, telefono, productos = [] }) => {
  const total = productos.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>FACTURA COMERCIAL</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Datos del Cliente</Text>
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Cliente:</Text>
              <Text style={styles.value}>{nombreCliente || '-'} </Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.label}>C.I.:</Text>
              <Text style={styles.value}>{numCedula || '-'} </Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{telefono || '-'} </Text>
            </View>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Información de Factura</Text>
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Vendedor:</Text>
              <Text style={styles.value}>{nombreVendedor || '-'} </Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Fecha:</Text>
              <Text style={styles.value}>{fecha || '-'} </Text>
            </View>
          </View>
        </View>

        <View style={styles.productsSection}>
          <Text style={styles.productsHeader}>Productos vendidos / comprados</Text>
          <View style={styles.productsTable}>
            <View style={[styles.productsRow, { borderBottomWidth: 1, borderBottomColor: '#999' }]}> 
              <Text style={[styles.productCell, styles.productId, styles.productHeaderCell]}>Código</Text>
              <Text style={[styles.productCell, styles.productId, styles.productHeaderCell]}>Nombre</Text>
              <Text style={[styles.productCell, styles.productName, styles.productHeaderCell]}>Descripción</Text>
              <Text style={[styles.productCell, styles.productQty, styles.productHeaderCell]}>Cantidad</Text>
              <Text style={[styles.productCell, styles.productPrice, styles.productHeaderCell]}>Precio</Text>
            </View>

            {productos.length === 0 ? (
              <View style={styles.productsRow}>
                <Text style={[styles.productCell, styles.productId]}>-</Text>
                <Text style={[styles.productCell, styles.productName]}>No hay productos seleccionados</Text>
                <Text style={[styles.productCell, styles.productQty]}>-</Text>
                <Text style={[styles.productCell, styles.productPrice]}>-</Text>
              </View>
            ) : (
              productos.map((producto, index) => (
                <View key={producto.id || index} style={styles.productsRow}>
                  <Text style={[styles.productCell, styles.productId]}>{producto.id}</Text>
                  <Text style={[styles.productCell, styles.productId]}>{producto.nombre}</Text>
                  <Text style={[styles.productCell, styles.productName]}>{producto.descripcion}</Text>
                  <Text style={[styles.productCell, styles.productQty]}>{producto.cantidad}</Text>
                  <Text style={[styles.productCell, styles.productPrice]}>${producto.precio}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default FacturaPDF;
