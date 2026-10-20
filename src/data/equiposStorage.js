
const CLAVE = 'esports_equipos';

// READ: leer equipos guardados
export function leerEquipos() {
    try {
        const datos = JSON.parse(
            localStorage.getItem(CLAVE) || '[]'
        );

        return Array.isArray(datos) ? datos : [];
    } catch {
        return [];
    }
}

function guardarEquipos(equipos) {
    localStorage.setItem(CLAVE, JSON.stringify(equipos));
}

// CREATE: crear un equipo
export function crearEquipo(datos) {
    const nuevoEquipo = {
        ...datos,
        id: crypto.randomUUID()
    };

    const equipos = leerEquipos();
    guardarEquipos([...equipos, nuevoEquipo]);

    return nuevoEquipo;
}

// UPDATE: actualizar equipo
export function actualizarEquipo(id, cambios) {
    const equipos = leerEquipos().map((equipo) =>
        equipo.id === id
            ? { ...equipo, ...cambios, id }
            : equipo
    );

    guardarEquipos(equipos);

    return equipos;
}

// DELETE: eliminar equipo
export function eliminarEquipo(id) {
    const equipos = leerEquipos().filter(
        (equipo) => equipo.id !== id
    );

    guardarEquipos(equipos);

    return equipos;
}
