


 const button = document.querySelectorAll('.boton');

 const search = document.querySelector(`#buscador`);
 search.addEventListener(`click`,buscador)
 

 
 function buscador(){
     fetch(`data.json`)
     .then((Response)=>Response.json())
     .then((data) =>{
        console.log(data)  
     }
     )
 };
 
  

let carrito = [];
const tbody = document.querySelector('.tbody')
const btnVaciar = document.querySelector('.vaciarCarrito');

button.forEach(btn => {
    btn.addEventListener('click', agregarAlCarrito)
    
})

function agregarAlCarrito(e) {
    const button = e.target;
    const item = button.closest('.card');
    const itemTitulo = item.querySelector('.card-title').textContent;
    const itemPrecio = item.querySelector('.precio').textContent;
    const itemImg = item.querySelector('.card-img-top').src;

    const newItem = {
        titulo: itemTitulo,
        precio: parseFloat(itemPrecio),
        img: itemImg,
        cantidad: 1
    }


    agregarItemCarrito(newItem);
}

function agregarItemCarrito(item) {

    const inputElemento = tbody.getElementsByClassName('inputElemento')

    for (let index = 0; index < carrito.length; index++) {
        if (carrito[index].titulo.trim() === item.titulo.trim()) {
            carrito[index].cantidad ++;
            const inputValue = inputElemento[index];
            inputValue.value ++;
            carritoTotal();
            return null;
        }
    }

    carrito.push(item);
    crearCarrito();
}

function crearCarrito() {
    tbody.innerHTML = '';
    carrito.map(item => {
        const tr = document.createElement('tr');
        tr.classList.add('itemCarrito')
        const Content = `
        <th scope="row" class="text-light text-center">1</th>
                <td class="table__productos pt-3">
                    <img class=" img-thumbnail rounded mx-auto d-block" src=${
            item.img
        }>
                    <h6 class="title text-light text-center pt-2">${
            item.titulo
        }</h6>
                </td>
                <td class="table__precio text-light pt-3 text-center"><p> $ ${
            item.precio
        }</p></td>
                <td class="table__cantidad pt-3 d-flex justify-content-center ">
                    <input  type="number"min="1" value=${
            item.cantidad
        } class="text-center inputElemento">
                    <button class="delete btn btn-danger"> X </button>
                </td>
        `
        tr.innerHTML = Content;
        tbody.append(tr);

        tr.querySelector('.delete').addEventListener('click', removerItemCarrito);
        tr.querySelector('.inputElemento').addEventListener('change', sumarCantidad)
    })
    carritoTotal();
}


function carritoTotal() {
    let total = 0;
    const itemCarritoTotal = document.querySelector('.cambiarPrecio');
    carrito.forEach((item) => {
        const precio = (item.precio)
        total += precio * item.cantidad
    })
    itemCarritoTotal.innerHTML = "$" + total;
    addLocalStorage();
}

function removerItemCarrito(e) {
    const buttonDelete = e.target
    const tr = buttonDelete.closest(".itemCarrito");

    const titulo = tr.querySelector('.title').textContent;
    for (let index = 0; index < carrito.length; index++) {

        if (carrito[index].titulo.trim() === titulo.trim()) {
            carrito.splice(index, 1)
        }
    }

    tr.remove();
    carritoTotal();

}

function sumarCantidad(e) {
    const sumaInput = e.target;
    const tr = sumaInput.closest('.itemCarrito');
    const titulo = tr.querySelector('.title').textContent;
    carrito.forEach(item => {
        if (item.titulo.trim() === titulo) {
            if (sumaInput.value < 1) {
                sumaInput = 1;
            } else {
                item.cantidad = sumaInput.value;
                carritoTotal();

            }
        }
    })
}

function addLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

window.onload = function () {
    const storage = JSON.parse(localStorage.getItem('carrito'));
    if (storage) {
        carrito = storage;
        crearCarrito();
    }
}


btnVaciar.addEventListener('click', () => {
    tr = document.querySelectorAll("tr");
    carrito = [];
    tbody.innerHTML = '';
    carritoTotal();
})

/*finalizar compra*/
const btncomprar = document.querySelector(`.botoncomprar`);

btncomprar.addEventListener(`click`,()=>{
  Swal.fire({
    title: `¿Desea realizar la compra?`,
    icon: `question`,
    showCancelButton: true,
    confirmButtonColor: `#07CB14 `,
    cancelButtonColor: `#DF0427 `,
    confirmButtonText: `¡Si, Quiero!`
  }).then((result)=>{
    if(result.isConfirmed){
        Swal.fire(
            `Compra realizada con exito`,
        )
        tr=document.querySelectorAll("tr");
        carrito=[];
        tbody.innerHTML = ``;
        carritoTotal();
        console.log(carrito);
    }
  }) 
}
)
