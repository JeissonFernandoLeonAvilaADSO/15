document.addEventListener("DOMContentLoaded", function () {
    const botonAbrir = document.getElementById("boton-abrir");
    const sobreContainer = document.getElementById("sobre-container");
    const invitacion = document.getElementById("invitacion");

    // Ocultar sobre y mostrar invitación
    sobreContainer.style.display = "none";
    invitacion.style.display = "block";

    botonAbrir.addEventListener("click", function () {
        sobreContainer.style.display = "none";
        invitacion.style.display = "block";
    });

    let timelineSection = document.querySelector(".timeline-container");
    let timeline = document.querySelector(".timeline");
    let progress = document.querySelector(".progress");
    let events = document.querySelectorAll(".event");

    if (!timelineSection || !timeline || !progress || events.length === 0) return;

    function actualizarLineaTiempo() {
        let scrollTop = window.scrollY;
        let sectionTop = timelineSection.offsetTop;
        let sectionHeight = timelineSection.offsetHeight;
        let windowHeight = window.innerHeight;
        let sectionBottom = sectionTop + sectionHeight;
        let centroPantalla = scrollTop + windowHeight / 2;

        if (centroPantalla < sectionTop) {
            progress.style.height = "0%";
            events.forEach(event => event.classList.remove("visible-text"));
            return;
        }

        if (centroPantalla > sectionBottom) {
            progress.style.height = "100%";
            events.forEach(event => event.classList.add("visible-text"));
            return;
        }

        let porcentaje = ((centroPantalla - sectionTop) / sectionHeight) * 100;
        porcentaje = Math.max(0, Math.min(100, porcentaje));

        progress.style.height = `${porcentaje}%`;

        events.forEach(event => {
            let porcentajeEvento = parseFloat(event.dataset.percentage);

            if (porcentaje >= porcentajeEvento) {
                event.classList.add("visible-text");
            } else {
                event.classList.remove("visible-text");
            }
        });
    }

    window.addEventListener("scroll", actualizarLineaTiempo);
    actualizarLineaTiempo();

    function actualizarContador() {
        const eventoFecha = new Date("March 26, 2025 19:00:00 GMT-5").getTime();
        const ahora = new Date().getTime();
        const diferencia = eventoFecha - ahora;

        if (diferencia > 0) {
            const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
            const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

            document.getElementById("days").textContent = dias;
            document.getElementById("hours").textContent = horas;
            document.getElementById("minutes").textContent = minutos;
            document.getElementById("seconds").textContent = segundos;
        } else {
            document.querySelector(".countdown-content").innerHTML = "<h2>¡El evento ha comenzado!</h2>";
        }
    }

    setInterval(actualizarContador, 1000);
    actualizarContador();

    const selectAsistentes = document.getElementById("num-asistentes");
    const botonConfirmar = document.getElementById("confirmar-btn");
    const mensajeConfirmacion = document.getElementById("confirmacion-mensaje");

    botonConfirmar.addEventListener("click", function () {
        const asistentesSeleccionados = selectAsistentes.value.trim();

        if (!asistentesSeleccionados) {
            Swal.fire({
                title: "⚠️ Error",
                text: "Debes ingresar el nombre de la familia antes de confirmar.",
                icon: "warning",
                confirmButtonText: "Aceptar"
            });
            return;
        }

        mensajeConfirmacion.style.color = "green";
        mensajeConfirmacion.textContent = `✅ Has confirmado asistencia para: ${asistentesSeleccionados}`;
    });

    document.querySelector("form").addEventListener("submit", async function(event) {
        event.preventDefault(); // Evita que la página se recargue

        const form = event.target;
        const formData = new FormData(form);

        // Enviar datos a Netlify
        try {
            const response = await fetch("/", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                Swal.fire({
                    title: "¡Asistencia confirmada!",
                    text: "Tu confirmación ha sido enviada correctamente.",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });

                form.reset(); // Limpia el formulario después del envío
            } else {
                Swal.fire({
                    title: "❌ Error",
                    text: "Hubo un problema al enviar la confirmación. Inténtalo de nuevo.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "❌ Error",
                text: "No se pudo conectar con el servidor. Revisa tu conexión e intenta nuevamente.",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    });
});
