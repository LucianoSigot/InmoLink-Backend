export default class ListaDeTareas {
    constructor(usuarioId, titulo, descripcion, completada = false, idTarea) {
        this.usuarioId = usuarioId;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.completada = completada;
        this.idTarea = idTarea;
    }

    getid() {
        return this.usuarioId;
    }
    getidTarea() {
        return this.idTarea;
    }
    getTitulo() {
        return this.titulo;
    }
    getDescripcion() { 
        return this.descripcion;
    }
    getCompletada() {
        return this.completada;
    }

    setDescripcion(descripcion) {
        this.descripcion = descripcion;
    }
    setTitulo(titulo) {
        this.titulo = titulo;
    }
    setCompletada(completada) {
        this.completada = completada;
    }
    setIdTarea(idTarea) {
        this.idTarea = idTarea;
    }

}