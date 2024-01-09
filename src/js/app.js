let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarSeccion();//Muestra y oculta las secciones
    tabs(); //Cambia las secciones cuando se presionen los tabs
    botonesPaginador(); //Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI()// Consulta la API en el back-end de PHP

    nombreCliente(); // Añade el nombre del cliente al objeto de cita

    idCliente(); // Añade el id del cliente al objeto de cita

    seleccionarFecha(); // Añade la fecha al objeto de cita

    seleccionarHora(); // Añade la hora de la cita en el objeto

    mostrarResumen(); // Muestra el resumen de la cita

}

function mostrarSeccion(){
    //Ocultar la sección que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar');
    }

    // Seleccionar la sección con el paso
    const pasoSelector = `#paso-${paso}`
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    //Quita la clase actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab actual

    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs(){
    //Agrega y cambia la variable de paso según el tab seleccionado
    const botones = document.querySelectorAll('.tabs button')

    botones.forEach( boton => {
        boton.addEventListener('click', function(e){
            paso = parseInt(e.target.dataset.paso);

            mostrarSeccion();

            botonesPaginador();

        })
    })
}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(paso === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else if(paso === 3){
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    } else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}


function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function(){
        if(paso <= pasoInicial){
            return;
        }else{
            paso--;
        }
        botonesPaginador();
    });
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function(){
        if(paso >= pasoFinal){
            return;
        }else{
            paso++;
        }
        botonesPaginador();
    });
}

async function consultarAPI(){
    try {
        const url = '/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);
    } catch (error) {
        console.log('error');
    }
}

function mostrarServicios(servicios){
    servicios.forEach(servicio => {
        const {id, nombre, precio} = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;
        
        const precioServicio = document.createElement('P')
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function(){
            seleccionarServicio(servicio);
        };

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    })
}

function seleccionarServicio(servicio){
    const {id} = servicio;
    const {servicios} = cita;
    
    //Identificar el elemento al que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    //Comprobar si un servicio ya fue agregado o quitarlo
    if( servicios.some( agredado => agredado.id === id)){
        //Eliminarlo
        cita.servicios = servicios.filter( agredado => agredado.id !== id);
        divServicio.classList.remove('seleccionado');
    }else{
        //Agregarlo
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
   
}


function idCliente(){
    id = document.querySelector('#id').value;
    cita.id = id;
}

function nombreCliente(){
    nombre = document.querySelector('#nombre').value;
    cita.nombre = nombre;
}

function seleccionarFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e){
        
        const dia = new Date(e.target.value).getUTCDay();

        if([6,0].includes(dia)) {
            e.target.value = '';
            mostrarAlerta('Fines de semanano permitidos', 'error', '.formulario');
        } else{
            cita.fecha = e.target.value;
        }

    });
}

function seleccionarHora(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e){
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];
        if(hora < 10 || hora > 18){
            mostrarAlerta('Hora No Valida', 'error', '.formulario');
            e.target.value = "";
        }else{
            cita.hora = e.target.value;
        }
    }); 
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true){

    // Previene que se cree más de una alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        alertaPrevia.remove();
    }


    // Crea la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece){
        // Elimina la alerta
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
        
}

function mostrarResumen(){
    const resumen = document.querySelector('.contenido-resumen');

    
    // Limpiar el contenido de resumen
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0 ){
        mostrarAlerta('Faltan datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen', false);
        return;
    }

    //Formatear el div de resumen
    const { nombre, hora, fecha, servicios } = cita;


    // Heading para servicios en resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios'
    resumen.appendChild(headingServicios);

    //Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const {id, nombre, precio} = servicio;
        const contendorServicio = document.createElement('DIV');
        contendorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;
        
        const precioServicio = document.createElement('P');
        precioServicio.innerHTML= `<span>Precio:</span> $${precio}`;

        contendorServicio.appendChild(textoServicio);
        contendorServicio.appendChild(precioServicio);

        resumen.appendChild(contendorServicio);
    });

    // Heading para Cita en resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita'
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    //Formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const ano = fechaObj.getFullYear();

    const fechaUTC = new Date( Date.UTC(ano, mes, dia));

    const opciones = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);


    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;
    
    //Botón para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);
}

async function reservarCita(){
    const { nombre, id, fecha, hora, servicios } = cita;
    
    const idServicios = servicios.map( servicio => servicio.id)

    const datos = new FormData();
    datos.append('usuarioId', id);
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('servicios', idServicios);
    
    try {
        const url = '/api/citas';
        const respuesta = await fetch(url, { 
            method: 'POST',
            body: datos
        });
        
        //Petición hacia la API
        
        const resultado = await respuesta.json();
    
        if(resultado.resultado){
            Swal.fire({
                icon: "success",
                title: "Cita Creada",
                text: "Tu cita fue creada correctamente",
                button: 'OK'
              }).then( () => {
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
              });
        }else{
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un error al guardar la cita",
                button: 'OK'
            });    
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al guardar la cita",
            button: 'OK'
          });
    }




    // console.log(respuesta);

    //console.log([...datos]);

    
}
