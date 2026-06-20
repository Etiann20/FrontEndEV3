import React, { useState, useEffect } from 'react';

function ProductForm() {

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState(null);
  const [visualizacion, setVisualizacion] = useState('');
  const [errores, setErrores] = useState({});
  const [productos, setProductos] = useState([]);
  const [temaOscuro, setTemaOscuro] = useState(true);

  useEffect(() => {

    if (temaOscuro) {
  
      document.body.classList.remove('light-body');
      document.body.classList.add('dark-body');
  
    } else {
  
      document.body.classList.remove('dark-body');
      document.body.classList.add('light-body');
    }
  
  }, [temaOscuro]);

  const validarFormulario = () => {

    let nuevosErrores = {};

    if (nombre.trim() === '') {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }

    if (descripcion.trim() === '') {
      nuevosErrores.descripcion = 'La descripción es obligatoria';
    }

    if (precio === '') {
      nuevosErrores.precio = 'El precio es obligatorio';
    } else if (precio <= 0) {
      nuevosErrores.precio = 'El precio debe ser mayor a 0';
    }

    if (categoria === '') {
      nuevosErrores.categoria = 'Debe seleccionar una categoría';
    }

    if (stock === '') {
      nuevosErrores.stock = 'El stock es obligatorio';
    } else if (stock < 0) {
      nuevosErrores.stock = 'El stock no puede ser negativo';
    }

    if (!imagen) {
      nuevosErrores.imagen = 'Debe seleccionar una imagen';
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const verImagen = (e) => {

    const archivo = e.target.files[0];

    if (!archivo) return;

    const maximo = 2 * 1024 * 1024;

    if (archivo.size > maximo) {

      setImagen(null);
      setVisualizacion('');

      setErrores({
        ...errores,
        imagen: 'La imagen supera el tamaño permitido de 2MB'
      });

      return;
    }

    setErrores({
      ...errores,
      imagen: ''
    });

    setImagen(archivo);
    setVisualizacion(URL.createObjectURL(archivo));
  };

  const guardarProducto = (e) => {

    e.preventDefault();

    if (!validarFormulario()) return;

    const nuevoProducto = {
      nombre,
      descripcion,
      precio,
      categoria,
      stock,
      visualizacion
    };

    setProductos([...productos, nuevoProducto]);

    setNombre('');
    setDescripcion('');
    setPrecio('');
    setCategoria('');
    setStock('');
    setImagen(null);
    setVisualizacion('');
    setErrores({});
  };

  const eliminarProducto = (index) => {

    const confirmar = window.confirm(
      '¿Desea eliminar este producto?'
    );

    if (confirmar) {

      const nuevosProductos = productos.filter(
        (_, i) => i !== index
      );

      setProductos(nuevosProductos);
    }
  };

  return (

    <div className={`contenedor ${temaOscuro ? 'dark' : 'light'}`}>

        <button
        className="toggle-theme"
        onClick={() => setTemaOscuro(!temaOscuro)}
        type="button"
        >
        {temaOscuro ? '☀️': '🌙'}
        </button>

      <header className="hero">
        <h1>TechZone Store</h1>

        <p>
          Plataforma de gestión de productos tecnólogicos,
          inventario y catálogo
        </p>
      </header>

      <div className="estadisticas">

      <div className="stat">
        <h3>
            $
            {
                productos.reduce(
                    (total, producto) =>
                        total + Number(producto.precio),
                    0
                ).toLocaleString('es-CL')
            }
        </h3>

        <span>Valor Inventario</span>
        </div>

      </div>

      <form onSubmit={guardarProducto}>

        <label>Nombre del producto</label>

        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        {errores.nombre &&
          <p className="error">{errores.nombre}</p>
        }

        <label>Descripción</label>

        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        {errores.descripcion &&
          <p className="error">{errores.descripcion}</p>
        }

        <label>Precio</label>

        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />

        {errores.precio &&
          <p className="error">{errores.precio}</p>
        }

        <label>Categoría</label>

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Seleccione</option>
          <option value="Notebook">Notebook</option>
          <option value="MotherBoard">MotherBoard</option>
          <option value="Tarjeta gráfica">Tarjeta Gráfica RTX 5090</option>
          <option value="Monitor">Monitor Gamer</option>
          <option value="Teclado">Teclado Mecánico</option>
          <option value="Mouse">Mouse Gamer</option>
        </select>

        {errores.categoria &&
          <p className="error">{errores.categoria}</p>
        }

        <label>Stock</label>

        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        {errores.stock &&
          <p className="error">{errores.stock}</p>
        }

        <label>Imagen del producto</label>

        <input
          type="file"
          accept="image/*"
          onChange={verImagen}
        />

        {errores.imagen &&
          <p className="error">{errores.imagen}</p>
        }

        {visualizacion && (

          <div>

            <h3>Vista Previa</h3>

            <img
              src={visualizacion}
              alt="Vista previa"
              className="visualizacion"
            />

          </div>

        )}

        <button type="submit">
          Agregar Producto
        </button>

      </form>

      <div className="lista-productos">

        {productos.map((producto, index) => (

          <div className="card" key={index}>

            <img
              src={producto.visualizacion}
              alt={producto.nombre}
            />

            <h3>{producto.nombre}</h3>

            <p>{producto.descripcion}</p>

            <p>
              <strong>Precio:</strong>
              {' '}
              $
              {Number(producto.precio).toLocaleString('es-CL')}
            </p>

            <p>
              <strong>Categoría:</strong>
              {' '}
              {producto.categoria}
            </p>

            <p>
              <strong>Stock:</strong>
              {' '}
              {producto.stock} unidades
            </p>

            <span
              className={
                producto.stock > 0
                  ? 'disponible'
                  : 'agotado'
              }
            >
              {
                producto.stock > 0
                  ? '🟢 Disponible'
                  : '🔴 Agotado'
              }
            </span>

            <button
              type="button"
              onClick={() => eliminarProducto(index)}
            >
              🗑 Eliminar
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ProductForm;