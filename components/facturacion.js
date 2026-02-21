import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// 1. Definimos los estilos (similares a CSS pero limitados)
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  header: { fontSize: 20, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  row: { flexDirection: 'row', borderBottom: '1px solid #EEE', padding: 5 },
  label: { fontWeight: 'bold', width: 100 },
  value: { flex: 1 }
});

// 2. Componente del Documento
const FacturaPDF = ({ datos }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.header}>FACTURA COMERCIAL</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Cliente:</Text>
        <Text style={styles.value}>ejemplo</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Fecha:</Text>
        <Text style={styles.value}>ejemplo</Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: 'bold' }}>Concepto: {datos.concepto}</Text>
        <Text style={{ marginTop: 10 }}>Total: $ejemplo</Text>
      </View>
    </Page>
  </Document>
);

export default FacturaPDF;