import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { getAuth } from "firebase/auth";
import { db } from "../firebase/config";
import {
  FaSearch,
  FaTrash,
  FaTruck,
  FaGift,
  FaPercentage,
} from "react-icons/fa";
import { IoCashOutline } from "react-icons/io5";
import { FaBarcode, FaRegUser } from "react-icons/fa6";
import { AiOutlineIdcard } from "react-icons/ai";
import { GrLocation, GrMoney } from "react-icons/gr";
import { IoMdAdd, IoMdRemove, IoMdClose } from "react-icons/io";

import {
  collection,
  onSnapshot,
  addDoc,
  Timestamp,
  doc,
  runTransaction,
} from "firebase/firestore";

function PuntoVentaPage() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [alerta, setAlerta] = useState(null);

  // 💳 PAGOS DINÁMICOS
  const [pagos, setPagos] = useState([
    { id: Date.now(), tipo: "Efectivo", monto: "" },
  ]);

  // 🎯 EXTRAS (descuento, propina, delivery)
  const [extras, setExtras] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "productos"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProductos(lista);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (carrito.length === 0) return;

      const ultimo = carrito[carrito.length - 1]; // producto activo

      if (e.key === "ArrowUp" || e.key === "+") {
        aumentarCantidad(ultimo.codigo);
      }

      if (e.key === "ArrowDown" || e.key === "-") {
        disminuirCantidad(ultimo.codigo);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [carrito]);

  const productosFiltrados = productos.filter(
    (p) =>
      p.producto?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo?.includes(busqueda),
  );

  const agregarProducto = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.codigo === producto.codigo);

      if (existe) {
        return prev.map((p) =>
          p.codigo === producto.codigo ? { ...p, cantidad: p.cantidad + 1 } : p,
        );
      }

      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const aumentarCantidad = (codigo) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p.codigo === codigo ? { ...p, cantidad: p.cantidad + 1 } : p,
      ),
    );
  };

  const disminuirCantidad = (codigo) => {
    setCarrito(
      (prev) =>
        prev
          .map((p) =>
            p.codigo === codigo ? { ...p, cantidad: p.cantidad - 1 } : p,
          )
          .filter((p) => p.cantidad > 0), // 👈 elimina si llega a 0
    );
  };

  const eliminarProducto = (codigo) => {
    setCarrito((prev) => prev.filter((p) => p.codigo !== codigo));
  };

  // ➕ PAGOS
  const agregarPago = () => {
    setPagos([...pagos, { id: Date.now(), tipo: "Efectivo", monto: "" }]);
  };

  const eliminarPago = (id) => {
    setPagos(pagos.filter((p) => p.id !== id));
  };

  const actualizarPago = (id, campo, valor) => {
    setPagos(pagos.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)));
  };

  // ➕ EXTRAS
  const agregarExtra = () => {
    setExtras([...extras, { id: Date.now(), tipo: "Descuento S/", monto: "" }]);
  };

  const eliminarExtra = (id) => {
    setExtras(extras.filter((e) => e.id !== id));
  };

  const actualizarExtra = (id, campo, valor) => {
    setExtras(extras.map((e) => (e.id === id ? { ...e, [campo]: valor } : e)));
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.venta * item.cantidad,
    0,
  );

  let descuentoTotal = 0;
  let propinaTotal = 0;
  let deliveryTotal = 0;

  extras.forEach((e) => {
    const monto = parseFloat(e.monto) || 0;

    if (e.tipo === "Descuento %") {
      descuentoTotal += (total * monto) / 100;
    }

    if (e.tipo === "Descuento S/") {
      descuentoTotal += monto;
    }

    if (e.tipo === "Propina") {
      propinaTotal += monto;
    }

    if (e.tipo === "Delivery") {
      deliveryTotal += monto;
    }
  });

  const totalFinal = total - descuentoTotal + propinaTotal + deliveryTotal;

  const totalPagado = pagos.reduce(
    (acc, p) => acc + (parseFloat(p.monto) || 0),
    0,
  );

  const vuelto = totalPagado - totalFinal;

  const getExtraStyle = (tipo) => {
    if (tipo.includes("Descuento")) {
      return {
        color: "from-red-400 to-red-600",
        icon: <FaPercentage />,
      };
    }

    if (tipo === "Propina") {
      return {
        color: "from-yellow-300 to-yellow-500",
        icon: <FaGift />,
      };
    }

    if (tipo === "Delivery") {
      return {
        color: "from-cyan-300 to-blue-400",
        icon: <FaTruck />,
      };
    }

    return {
      color: "from-gray-300 to-gray-400",
      icon: <GrMoney />,
    };
  };

  const cobrarVenta = async () => {
    if (carrito.length === 0) return alert("Carrito vacío");

    if (vuelto < -0.01) {
      mostrarAlerta("El monto pagado es insuficiente", "error");
      return;
    }

    // 🚨 VALIDAR STOCK
    const errores = validarStock();

    if (errores.length > 0) {
      const mensaje = errores
        .map((e) => `${e.producto} solo tiene ${e.stock} en stock`)
        .join("\n");

      mostrarAlerta(mensaje, "error");
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        mostrarAlerta("Usuario no autenticado", "error");
        return;
      }
      await runTransaction(db, async (transaction) => {
        // 🧾 CREAR VENTA
        // 📊 CONTADOR DE VENTAS
        const contadorRef = doc(db, "contadores", "ventas");
        const contadorSnap = await transaction.get(contadorRef);

        if (!contadorSnap.exists()) {
          throw new Error("No existe el contador de ventas");
        }

        const numeroActual = contadorSnap.data().numero;

        // 🔢 Incrementar contador
        transaction.update(contadorRef, {
          numero: numeroActual + 1,
        });

        // 🧾 CREAR VENTA
        const ventaRef = doc(collection(db, "ventas"));

        transaction.set(ventaRef, {
          tipo_comprobante: "Boleta Simple",
          num_venta: numeroActual,
          uid_usuario: user.uid, // luego lo conectas con auth
          fecha_venta: Timestamp.now(),
          subtotal: total,
          descuento: descuentoTotal,
          propina: propinaTotal,
          delivery: deliveryTotal,
          pagado: totalPagado,
          vuelto: vuelto,
          igv: 0.0,
          estado: "pagado",
        });

        // 🛒 DETALLE
        for (const item of carrito) {
          const detalleRef = doc(
            collection(db, "ventas", ventaRef.id, "detalle"),
          );

          await transaction.set(detalleRef, {
            ...item,
            vence: item.vence || null,
          });
        }

        // 💳 PAGOS
        for (const pago of pagos) {
          if (!pago.monto) continue;

          const pagoRef = doc(collection(db, "ventas", ventaRef.id, "pagos"));

          await transaction.set(pagoRef, {
            modo_pago: pago.tipo,
            monto: parseFloat(pago.monto),
          });
        }

        // 🎯 EXTRAS
        for (const extra of extras) {
          if (!extra.monto) continue;

          const extraRef = doc(collection(db, "ventas", ventaRef.id, "extras"));

          await transaction.set(extraRef, {
            modo_extra: extra.tipo,
            monto: parseFloat(extra.monto),
          });
        }

        // 📦 DESCONTAR STOCK (FIFO por vencimiento)
        for (const item of carrito) {
          let cantidadRestante = item.cantidad;

          const productosOrdenados = productos
            .filter((p) => p.codigo === item.codigo)
            .sort((a, b) => {
              const va = a.vence?.seconds || 9999999999;
              const vb = b.vence?.seconds || 9999999999;
              return va - vb;
            });

          for (const prod of productosOrdenados) {
            if (cantidadRestante <= 0) break;

            const ref = doc(db, "productos", prod.id);
            const stockActual = prod.stock || 0;

            if (stockActual <= 0) continue;

            const descontar = Math.min(stockActual, cantidadRestante);

            transaction.update(ref, {
              stock: stockActual - descontar,
            });

            cantidadRestante -= descontar;
          }
        }
      });

      // 🧹 LIMPIAR TODO
      setCarrito([]);
      setPagos([{ id: Date.now(), tipo: "Efectivo", monto: "" }]);
      setExtras([]);

      mostrarAlerta("Venta registrada correctamente ✅");
    } catch (error) {
      console.error(error);
      mostrarAlerta("Error al cobrar ❌", "error");
    }
  };

  const validarStock = () => {
    let errores = [];

    carrito.forEach((item) => {
      const productosMismoCodigo = productos.filter(
        (p) => p.codigo === item.codigo,
      );

      const stockTotal = productosMismoCodigo.reduce(
        (acc, p) => acc + (p.stock || 0),
        0,
      );

      if (item.cantidad > stockTotal) {
        errores.push({
          producto: item.producto,
          stock: stockTotal,
        });
      }
    });

    return errores;
  };

  const mostrarAlerta = (mensaje, tipo = "success") => {
    setAlerta({ mensaje, tipo });

    setTimeout(() => {
      setAlerta(null);
    }, 3000);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Sidebar
        abierto={sidebarAbierto}
        cerrar={() => setSidebarAbierto(false)}
      />

      <div className="flex-1 min-w-0">
        <Navbar abrirSidebar={() => setSidebarAbierto(true)} />

        <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PRODUCTOS */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-4">
            {/* ENCABEZADO*/}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-purple-800">
                  Nueva Venta
                </h2>
                <p className="text-sm text-purple-500">
                  Sistema de busqueda y control de productos a vender
                </p>
              </div>
            </div>

            {/* BUSCADOR*/}
            <div className="flex items-center gap-3 mb-4 bg-purple-50 rounded-xl px-4 py-2">
              <FaSearch className="text-purple-500" />
              <input
                type="text"
                placeholder="Buscar o escanear producto..."
                className="input input-ghost w-full focus:outline-none"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button className="btn rounded-xl bg-purple-700 text-white border-none hover:bg-purple-800">
                <FaBarcode />
              </button>
            </div>

            {/* LISTA DE PRODUCTOS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productosFiltrados.map((p) => (
                <div
                  key={p.id}
                  onClick={() =>
                    agregarProducto({
                      producto: p.producto,
                      venta: p.rebaja && p.rebaja !== 0 ? p.rebaja : p.venta,
                      codigo: p.codigo,
                    })
                  }
                  className="bg-purple-50 hover:bg-purple-100 cursor-pointer rounded-xl p-4 shadow-sm transition"
                >
                  {/* IMAGEN */}
                  <div className="w-full h-28 bg-white rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKnKnw0MtmVH5_-A-wrEh5OiTSL3lu_5MZZA&s"
                      alt={p.producto}
                      className="h-full object-contain"
                    />
                  </div>

                  {/* DATOS */}
                  <h3 className="text-xs md:text-sm font-bold text-purple-800">
                    {p.producto}
                  </h3>

                  <div className="flex items-center gap-2 mt-1">
                    {p.rebaja && p.rebaja !== 0 ? (
                      <>
                        {/* Precio original tachado */}
                        <p className="text-xs md:text-base text-gray-500 line-through">
                          S/ {p.venta.toFixed(2)}
                        </p>

                        {/* Precio con rebaja */}
                        <p className="text-xs md:text-base text-fuchsia-600 font-bold">
                          S/ {p.rebaja.toFixed(2)}
                        </p>
                      </>
                    ) : (
                      /* Precio normal */
                      <p className="text-xs md:text-base text-fuchsia-600 font-bold">
                        S/ {p.venta.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">COD: {p.codigo}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CARRITO */}
          <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
            {/* TITULO DEL CARRITO */}
            <div className="text-lg font-bold text-purple-800 mb-4">
              Resumen de Compras
            </div>
            {/* RESUMEN DE COMPRAS */}
            <div className="flex-1 space-y-3 ">
              {carrito.map((item) => (
                <div
                  key={item.codigo}
                  className="flex flex-row justify-between items-center bg-purple-50 rounded-xl px-3 py-2 gap-2"
                >
                  <div className="">
                    <p className="font-semibold text-xs">{item.producto}</p>
                    <p className="text-xs text-gray-500">
                      P. Uni: S/ {item.venta.toFixed(2)} - S/{" "}
                      {(item.venta * item.cantidad).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">cod: {item.codigo}</p>
                  </div>

                  {/* CONTROLES */}
                  <div className="flex flex-col items-end gap-2 h-full">
                    <div className="flex flex-row gap-1">
                      <button
                        onClick={() => disminuirCantidad(item.codigo)}
                        className="btn btn-xs md:btn-sm bg-gray-200 rounded-lg"
                      >
                        <IoMdRemove />
                      </button>

                      <input
                        type="text"
                        value={item.cantidad}
                        readOnly
                        className="w-8 text-center input input-bordered input-xs md:input-sm text-base m-0 p-0 rounded-lg"
                      />

                      <button
                        onClick={() => aumentarCantidad(item.codigo)}
                        className="btn btn-xs md:btn-sm bg-gray-200 rounded-lg"
                      >
                        <IoMdAdd />
                      </button>
                    </div>

                    <button
                      onClick={() => eliminarProducto(item.codigo)}
                      className="btn btn-xs md:btn-sm bg-fuchsia-500 text-white hover:bg-fuchsia-600 border-none rounded-lg"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* SUBTOTALES*/}
            <div className="divider divider-primary"></div>
            <div className="">
              <div className="flex justify-between text-lg font-bold text-purple-800">
                <span>SubTotal</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
            </div>
            {/* PAGOS Y DESCUENTOS */}
            {/* PAGOS */}
            <div className="mt-3">
              {/* MAPA PAGOS 1 */}

              {pagos.map((pago) => (
                <div key={pago.id} className="flex flex-row gap-0 mt-2">
                  <button className="btn rounded-none rounded-l-xl bg-gradient-to-r from-lime-200 to-cyan-300 text-black border-none shadow-lg">
                    <GrMoney />
                  </button>

                  <select
                    value={pago.tipo}
                    onChange={(e) =>
                      actualizarPago(pago.id, "tipo", e.target.value)
                    }
                    className="select rounded-none bg-purple-50 border-none shadow-lg focus:outline-none outline-none"
                  >
                    <option>Efectivo</option>
                    <option>Yape</option>
                    <option>Plin</option>
                    <option>Transferencia</option>
                    <option>Agora</option>
                  </select>

                  <input
                    type="number"
                    value={pago.monto}
                    onChange={(e) =>
                      actualizarPago(pago.id, "monto", e.target.value)
                    }
                    placeholder="Monto"
                    className="input rounded-none bg-purple-50 text-sm w-full sm:w-28 border-none focus:outline-none outline-none shadow-lg"
                  />

                  <button
                    onClick={() => eliminarPago(pago.id)}
                    className="btn rounded-none rounded-r-xl bg-fuchsia-500 text-white border-none shadow-lg hover:bg-fuchsia-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              {/* Añadir mas pagos */}
              <div className="flex justify-end mt-4">
                <span
                  onClick={agregarPago}
                  className="text-xs font-bold cursor-pointer"
                >
                  + Añadir Pago
                </span>
              </div>
            </div>

            {/* DESCUENTOS, PROPINAS, DELIVERY */}
            {/* EXTRA */}
            <div className="mt-3">
              {/* MAPA EXTRA 1 */}
              {extras.map((extra) => {
                const estilo = getExtraStyle(extra.tipo);

                return (
                  <div key={extra.id} className="flex flex-row gap-0 mt-2">
                    <button
                      className={`btn rounded-none rounded-l-xl bg-gradient-to-r ${estilo.color} text-black border-none shadow-lg`}
                    >
                      {estilo.icon}
                    </button>

                    <select
                      value={extra.tipo}
                      onChange={(e) =>
                        actualizarExtra(extra.id, "tipo", e.target.value)
                      }
                      className="select rounded-none bg-purple-50 border-none shadow-lg focus:outline-none outline-none"
                    >
                      <option>Descuento %</option>
                      <option>Descuento S/</option>
                      <option>Propina</option>
                      <option>Delivery</option>
                    </select>

                    <input
                      type="number"
                      value={extra.monto}
                      onChange={(e) => {
                        let val = e.target.value;

                        if (extra.tipo === "Descuento %" && val > 100) {
                          val = 100;
                        }

                        actualizarExtra(extra.id, "monto", val);
                      }}
                      placeholder={
                        extra.tipo === "Descuento %" ? "Porcentaje" : "Monto"
                      }
                      className="input rounded-none bg-purple-50 text-sm w-full sm:w-28 border-none shadow-lg focus:outline-none outline-none"
                    />

                    <button
                      onClick={() => eliminarExtra(extra.id)}
                      className="btn rounded-none rounded-r-xl bg-fuchsia-500 text-white border-none shadow-lg hover:bg-fuchsia-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                );
              })}
              {/* Añadir mas pagos */}
              <div className="flex justify-end mt-4">
                <span
                  onClick={agregarExtra}
                  className="text-xs font-bold cursor-pointer"
                >
                  + Añadir Descuento, Propina, Delivery
                </span>
              </div>
            </div>
            <div className="divider divider-primary"></div>
            <div className="mt-2 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Descuento</span>
                <span>- S/ {descuentoTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Propina</span>
                <span>+ S/ {propinaTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>+ S/ {deliveryTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-bold text-lg mt-2">
                <span className="font-bold text-lg">Total Final</span>
                <span className="font-bold text-lg">
                  S/ {totalFinal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-bold text-lg">Pagado</span>
                <span className="font-bold text-lg">
                  S/ {totalPagado.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between mb-4">
                <span className="font-bold text-2xl text-purple-500">
                  Vuelto
                </span>
                <span className="font-bold text-2xl text-purple-500">
                  S/ {vuelto.toFixed(2)}
                </span>
              </div>
            </div>

            {alerta && (
              <div
                className={`alert shadow-lg mb-1 ${
                  alerta.tipo === "error" ? "alert-error" : "alert-success"
                }`}
              >
                <span>{alerta.mensaje}</span>
              </div>
            )}

            {/* BOTONES DE ACCIONES*/}
            <button
              onClick={cobrarVenta}
              className="btn w-full mt-2 rounded-xl bg-fuchsia-500 text-white border-none hover:bg-fuchsia-600"
            >
              Cobrar venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PuntoVentaPage;
