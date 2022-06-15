let contenedorCarrito = document.getElementById("contenedor-carrito")
const botonVaciarCarrito = document.getElementById("btn-vaciar-carrito")
const buscadorBarra = document.getElementById("formulario-buscador")
const busacarBoton = document.getElementById("buscar")
let productos = document.getElementById("contenedor-productos")
const templateCarrito = document.getElementById("carta-carrito")
const templateProductos = document.getElementById("carta-de-productos")
const vacio = document.querySelector(".vacio")

//este codigo esta preparado para poder comunicarla con una api , como lo hara no es problema mio
let carrito = []
const lista = []
let listaBuscador = []

document.addEventListener("DOMContentLoaded",()=>{
        fetchData()
        if(localStorage.getItem("todo")){
            carrito = JSON.parse(localStorage.getItem("todo"))
            Carrito.pintarCarrito(carrito)
        }
    }
)
const fetchData = async() =>{
    try{
        const res = await fetch("https://pokeapi.co/api/v2/pokemon/")
        const data = await res.json()
        const producto = await data.results.forEach(element => pokemonData(element.url))
    }catch(error){
        console.log(error)
    }
}
const pokemonData = async(url) =>{
    try{
        const res = await fetch(url)
        const data = await res.json()
        let producto = await new Carta(data.name , data.base_experience , data.sprites.front_default)
        let num = await lista.push(producto)
        producto.pintarCarta()
    }catch(error){
        console.log(error)
    }
}

/*-------------------Declaro mis class a partir de aca--------------------*/
class Productos {

    constructor( nombre , precio , img){
        this.nombre = nombre;
        this.precio = precio;
        this.img = img
        this.id = `${Date.now()}`
    }
}

class Carrito extends Productos {
    static pintarCarrito(data){
        contenedorCarrito.textContent= ""
        const fragment = document.createDocumentFragment()
        data.forEach(element => {
            const clone = templateCarrito.content.cloneNode(true)
            clone.querySelector("img").src = element.img
            clone.querySelector("tr .nombre").textContent = element.nombre
            clone.querySelector("tr .precio").textContent = element.precio
            clone.querySelector(".borrar-platillo").dataset.id= element.id
            fragment.appendChild(clone)
        })
        contenedorCarrito.appendChild(fragment)
    }
}
class Carta extends Productos {
    
    pintarCarta(){
        const fragment = document.createDocumentFragment()
        const clone = templateProductos.content.cloneNode(true)
        clone.querySelector(".card h4").textContent = this.nombre
        clone.querySelector(".card img").src = this.img
        clone.querySelector(".card p span").textContent = this.precio
        clone.querySelector(".button").dataset.id = this.id
        fragment.appendChild(clone)
        productos.appendChild(fragment)
    }
}

/*-----------------empiezo a pintar las cosas en pantalla a apartir de aca-------------------*/

document.addEventListener("click" ,e=>{

    if(e.target.matches(".agregar-carrito")){
        if(carrito.findIndex(element => e.target.dataset.id === element.id) === -1){
            carrito.push(lista.find(element => e.target.dataset.id === element.id))
            Carrito.pintarCarrito(carrito)
        }
    }
    if(e.target.matches(".borrar-platillo")){
        carrito = carrito.filter(element=>element.id !== e.target.dataset.id)
        Carrito.pintarCarrito(carrito)
    }
    if(carrito.length === 0){
        vacio.textContent= "carrito vacio"
    }else{
        vacio.textContent= ""
    }
    localStorage.setItem("todo" , JSON.stringify(carrito))
})

botonVaciarCarrito.addEventListener("click", e =>{

    e.preventDefault()
    carrito = []
    Carrito.pintarCarrito(carrito)
    localStorage.setItem("todo" , JSON.stringify(carrito))
})
buscadorBarra.addEventListener("submit", e=>{
    productos.textContent= ""
    e.preventDefault()
    const data = new FormData(buscadorBarra)
    const [str] = [...data.values()]
    const regExp = new RegExp (str)
    if(!str.trim()){
        lista.forEach(element=> element.pintarCarta())
    }else{
        listaBuscador = lista.filter(element => regExp.test(element.nombre))
        listaBuscador.forEach(element=> element.pintarCarta())
    }
}
)