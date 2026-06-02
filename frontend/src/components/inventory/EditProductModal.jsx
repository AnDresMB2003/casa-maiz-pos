import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

function EditProductModal({
  open,
  product,
  onClose,
  onUpdated,
}) {

  const [form, setForm] =
    useState({
      name: "",
      price: "",
      stock: "",
      category: "",
      image: "",
    });

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    if (!open || !product)
      return;

    queueMicrotask(() => {

      setForm({
        name:
          product.name || "",
        price:
          product.price || "",
        stock:
          product.stock || "",
        category:
          product.category ||
          "",
        image:
          product.image || "",
      });

      setPreview(
        product.image || ""
      );
    });

  }, [
    open,
    product,
  ]);

  if (!open || !product)
    return null;

  function updateField(
    key,
    value
  ) {

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleImage(
    e
  ) {

    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend =
      () => {

        updateField(
          "image",
          reader.result
        );

        setPreview(
          reader.result
        );
      };

    reader.readAsDataURL(
      file
    );
  }

  async function handleSave() {

    try {

      setLoading(true);

      const response =
        await axios.put(
          `http://localhost:4000/api/products/${product.id}`,
          {
            ...form,
            price:
              Number(
                form.price
              ),
            stock:
              Number(
                form.stock
              ),
          }
        );

      toast.success(
        "Producto actualizado"
      );

      onUpdated(
        response.data
      );

      onClose();

    } catch (error) {

      console.log(error);

      toast.error(
        "Error actualizando producto"
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/40
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-4
      "
    >

      <div
        className="
          bg-white
          w-full
          max-w-2xl
          rounded-3xl
          p-7
          shadow-2xl
        "
      >

        <div
          className="
            flex
            justify-between
            items-center
            mb-7
          "
        >

          <div>

            <h2
              className="
                text-3xl
                font-black
              "
            >
              Editar producto
            </h2>

            <p
              className="
                text-gray-500
              "
            >
              Actualiza la
              información
            </p>

          </div>

          <button
            onClick={onClose}
            className="
              w-11
              h-11
              rounded-2xl
              bg-red-800
            "
          >
            ✕
          </button>

        </div>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          "
        >

          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              updateField(
                "name",
                e.target.value
              )
            }
            placeholder="Nombre"
            className="
              border
              rounded-2xl
              p-4
              text-gray-900
              placeholder-gray-500
            "
          />

          <input
            type="number"
            value={form.price}
            onChange={(e) =>
              updateField(
                "price",
                e.target.value
              )
            }
            placeholder="Precio"
            className="
              border
              rounded-2xl
              p-4
              text-gray-900
              placeholder-gray-500
            "
          />

          <input
            type="number"
            value={form.stock}
            onChange={(e) =>
              updateField(
                "stock",
                e.target.value
              )
            }
            placeholder="Stock"
            className="
              border
              rounded-2xl
              p-4
              text-gray-900
              placeholder-gray-500
            "
          />

          <input
            type="text"
            value={
              form.category
            }
            onChange={(e) =>
              updateField(
                "category",
                e.target.value
              )
            }
            placeholder="Categoría"
            className="
              border
              rounded-2xl
              p-4
              text-gray-900
              placeholder-gray-500
            "
          />

        </div>

        <div
          className="
            mt-6
            border-2
            border-dashed
            rounded-3xl
            p-6
            text-center
          "
        >

          <input
            type="file"
            accept="image/*"
            id="editImage"
            className="hidden"
            onChange={
              handleImage
            }
          />

          <label
            htmlFor="editImage"
            className="
              inline-flex
              bg-black
              text-white
              px-5
              py-3
              rounded-2xl
              cursor-pointer
              font-semibold
            "
          >
            📁 Cambiar imagen
          </label>

          {preview && (

            <img
              src={preview}
              alt="preview"
              className="
                w-40
                h-40
                rounded-3xl
                object-cover
                mx-auto
                mt-6
              "
            />

          )}

        </div>

        <div
          className="
            flex
            justify-end
            gap-3
            mt-8
          "
        >

          <button
            onClick={onClose}
            className="
              px-5
              py-3
              rounded-2xl
              bg-red-800
            "
          >
            Cancelar
          </button>

          <button
            onClick={
              handleSave
            }
            disabled={
              loading
            }
            className="
              px-6
              py-3
              rounded-2xl
              bg-black
              text-white
              font-bold
            "
          >

            {loading
              ? "Guardando..."
              : "Guardar"}

          </button>

        </div>

      </div>

    </div>
  );
}

export default EditProductModal;