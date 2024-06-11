async function obtenerDatosFirestore() {
    const snapshot = await db.collection("datos").get();
    const datos = snapshot.docs.map(doc => {
        const docData = doc.data();
        // Ordenar los datos de acuerdo al orden de columnas
        return {
            'Clave de Elector': docData.claveElector,
            'Nombres': docData.nombres,
            'Apellido Paterno': docData.apellidoPaterno,
            'Apellido Materno': docData.apellidoMaterno,
            'Calle y Número': docData.calleYNumero,
            'Colonia': docData.colonia,
            'Municipio': docData.municipio,
            'Teléfono': docData.telefono,
            'Sección': docData.seccion
        };
    });
    return datos;
}

function exportarExcel(datos) {
    if (!datos) {
        console.error("Los datos son undefined o null.");
        return;
    }
    // Especificar el orden de las columnas
    const ordenColumnas = [
        'Clave de Elector',
        'Nombres',
        'Apellido Paterno',
        'Apellido Materno',
        'Calle y Número',
        'Colonia',
        'Municipio',
        'Teléfono',
        'Sección'
    ];

    // Crear el libro de Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([ordenColumnas]);

    // Agregar los datos al libro de Excel
    datos.forEach(dato => {
        const fila = ordenColumnas.map(columna => dato[columna]);
        XLSX.utils.sheet_add_aoa(ws, [fila], { origin: -1 });
    });

    // Ajustar el ancho de las columnas
    const columnWidths = ordenColumnas.map(_ => ({ wch: 20 })); // Ancho predeterminado de 20
    ws['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    const nombreArchivo = "datos.xlsx";
    XLSX.writeFile(wb, nombreArchivo);
}

document.getElementById('btnExportarExcel').addEventListener('click', async function() {
    const datos = await obtenerDatosFirestore();
    exportarExcel(datos);
});
