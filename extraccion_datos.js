document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('btnExtraer').addEventListener('click', extraerDatos);
    document.getElementById('btnExportarExcel').addEventListener('click', function() {
        exportarExcel();
    });
    
});
function extraerDatos() {
    var textoEscaneado = document.getElementById('textoEscaneado').value;

    // Extrae los datos del texto escaneado
    var datosExtraidos = {
        claveElector: extraerClaveElector(textoEscaneado),
        nombres: extraerNombres(textoEscaneado),
        apellidoPaterno: extraerApellidoPaterno(textoEscaneado),
        apellidoMaterno: extraerApellidoMaterno(textoEscaneado),
        calleYNumero: extraerCalleYNumero(textoEscaneado),
        colonia: extraerColonia(textoEscaneado),
        municipio: extraerMunicipio(textoEscaneado),
        telefono: document.getElementById('telefono').value,
        seccion: extraerSeccion(textoEscaneado),
    };
    mostrarDatos(datosExtraidos);
}

function extraerClaveElector(texto) {
    // Buscar la secuencia de 18 caracteres que sigue al texto "CLAVE DE ELECTOR"
    var regex = /CLAVE DE ELECTOR\s*([\w\d]{18})/i;
    var match = texto.match(regex);
    if (match) {
        return match[1];
    } else {
        return "No encontrado";
    }
}

function extraerNombres(texto) {
    // Dividir el texto en líneas
    var lineas = texto.split('\n');

    // Buscar la línea anterior a la palabra "DOMICILIO"
    var indiceDomicilio = lineas.findIndex(function(linea) {
        return linea.includes("DOMICILIO");
    });

    // Si se encuentra la línea anterior a "DOMICILIO"
    if (indiceDomicilio !== -1 && indiceDomicilio > 0) {
        // Extraer los nombres de la línea anterior
        var nombres = lineas[indiceDomicilio - 1].trim();
        return nombres;
    } else {
        return "No encontrado";
    }
}


function extraerApellidoPaterno(texto) {
    var regex = /NOMBRE\n((?:[\w\s.]+\n)+)/i;
    var match = texto.match(regex);
    if (match && match[1]) {
        var nombres = match[1].trim().split('\n');
        return nombres[0].trim();
    } else {
        return "No encontrado";
    }
}

function extraerApellidoMaterno(texto) {
    var regex = /NOMBRE\n((?:[\w\s.]+\n)+)/i;
    var match = texto.match(regex);
    if (match && match[1]) {
        var nombres = match[1].trim().split('\n');
        return nombres[1].trim();
    } else {
        return "No encontrado";
    }
}

function extraerCalleYNumero(texto) {
    var regex = /DOMICILIO\n(.+)\n/i;
    var match = texto.match(regex);
    if (match && match.length > 1) {
        return match[1].trim();
    } else {
        return "No encontrado";
    }
}

function extraerColonia(texto) {
    var regex = /DOMICILIO\n.+\n(.+)\n/i;
    var match = texto.match(regex);
    if (match && match.length > 1) {
        return match[1].trim();
    } else {
        return "No encontrado";
    }
}

function extraerMunicipio(texto) {
    // Dividir el texto en líneas
    var lineas = texto.split('\n');

    // Buscar la línea que contiene el municipio
    var lineaMunicipio = lineas.find(function(linea) {
        return linea.includes(",");
    });

    // Si se encuentra la línea del municipio
    if (lineaMunicipio) {
        // Extraer el municipio
        var municipio = lineaMunicipio.split(",")[0].trim();
        return municipio;
    } else {
        return "No encontrado";
    }
}

function extraerSeccion(texto) {
    var regex = /\b(0[1-4][0-9]{2}|0500)\b/g;
    var matches = texto.match(regex);
    if (matches && matches.length > 0) {
        // Tomamos el último resultado que probablemente sea la sección
        return matches[matches.length - 1].trim();
    } else {
        return "No encontrado";
    }
}

// Esta función muestra los datos extraídos en el resultado
function mostrarDatos(datos) {
    var resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '<h2>Datos Extraídos:</h2>' +
                              '<p><strong>Clave de Elector:</strong> <input type="text" id="claveElector" value="' + datos.claveElector + '"></p>' +
                              '<p><strong>Nombres:</strong> <input type="text" id="nombres" value="' + datos.nombres + '"></p>' +
                              '<p><strong>Apellido Paterno:</strong> <input type="text" id="apellidoPaterno" value="' + datos.apellidoPaterno + '"></p>' +
                              '<p><strong>Apellido Materno:</strong> <input type="text" id="apellidoMaterno" value="' + datos.apellidoMaterno + '"></p>' +
                              '<p><strong>Calle y Numero:</strong> <input type="text" id="calleYNumero" value="' + datos.calleYNumero + '"></p>' +
                              '<p><strong>Colonia:</strong> <input type="text" id="colonia" value="' + datos.colonia + '"></p>' +
                              '<p><strong>Municipio:</strong> <input type="text" id="municipio" value="' + datos.municipio + '"></p>' +
                              '<p><strong>Telefono:</strong> <input type="text" id="telefono" value="' + datos.telefono + '"></p>' +
                              '<p><strong>Seccion:</strong> <input type="text" id="seccion" value="' + datos.seccion + '"></p>' +
                              '<button onclick="guardarDatos()">Guardar</button>';
}

function guardarDatos() {
    var claveElector = document.getElementById('claveElector').value;
    var nombres = document.getElementById('nombres').value;
    var apellidoPaterno = document.getElementById('apellidoPaterno').value;
    var apellidoMaterno = document.getElementById('apellidoMaterno').value;
    var calleYNumero = document.getElementById('calleYNumero').value;
    var colonia = document.getElementById('colonia').value;
    var municipio = document.getElementById('municipio').value;
    var telefono = document.getElementById('telefono').value;
    var seccion = document.getElementById('seccion').value;

    if (!claveElector || !nombres || !apellidoPaterno || !apellidoMaterno || !calleYNumero || !colonia || !municipio || !telefono || !seccion) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Por favor, llene todos los campos.'
        });
        return;
    }

    db.collection("datos").where("claveElector", "==", claveElector).get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'La clave de elector ya está registrada en la base de datos.'
                });
            } else {
                var datosActualizados = {
                    claveElector: claveElector,
                    nombres: nombres,
                    apellidoPaterno: apellidoPaterno,
                    apellidoMaterno: apellidoMaterno,
                    calleYNumero: calleYNumero,
                    colonia: colonia,
                    municipio: municipio,
                    telefono: telefono,
                    seccion: seccion,
                };

                db.collection("datos").add(datosActualizados)
                    .then(function(docRef) {
                        console.log("Datos guardados con ID: ", docRef.id);
                        Swal.fire({
                            icon: 'success',
                            title: '¡Éxito!',
                            text: 'Los datos se han guardado exitosamente en Firestore.'
                        });
                    })
                    .catch(function(error) {
                        console.error("Error al guardar los datos: ", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ocurrió un error al intentar guardar los datos en Firestore. Por favor, inténtalo de nuevo más tarde.'
                        });
                    });
            }
        })
        .catch((error) => {
            console.error("Error al verificar la clave de elector: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ocurrió un error al verificar la clave de elector en Firestore. Por favor, inténtalo de nuevo más tarde.'
            });
        });
}
