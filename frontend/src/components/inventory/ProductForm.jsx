import {
  useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

function ProductForm({
  onCreated,
}) {

  const [name, setName] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [image, setImage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  function handleImage(e) {

    const file =
      e.target.files[0];

    if (!file)
      return;

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      toast.error(
        "La imagen es demasiado pesada"
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onloadend =
      () => {

        setImage(
          reader.result
        );
      };

    reader.readAsDataURL(
      file
    );
  }

  async function handleSubmit(e) {

    e.preventDefault();

    if (
      !name ||
      !price ||
      !stock
    ) {

      toast.error(
        "Completa los campos"
      );

      return;
    }

    try {

      setLoading(true);

      const response =
        await axios.post(
          "http://localhost:4000/api/products",
          {
            name,
            category,
            price,
            stock,
            image,
          }
        );

      onCreated(
        response.data
      );

      setName("");
      setCategory("");
      setPrice("");
      setStock("");
      setImage("");

    } catch (error) {

      console.log(error);

      toast.error(
        "Error creando producto"
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <form
      onSubmit={
        handleSubmit
      }
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-5
      "
    >

      <div>

        <label
          className="
            text-sm
            font-semibold
            text-gray-600
          "
        >
          Nombre
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          placeholder="Ej: Harina PAN"
          className="
            w-full
            mt-2
            border
            rounded-2xl
            px-4
            py-3
            outline-none
          "
        />

      </div>

      <div>

        <label
          className="
            text-sm
            font-semibold
            text-gray-600
          "
        >
          Categoría
        </label>

        <input
          type="text"
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          placeholder="Ej: Granos"
          className="
            w-full
            mt-2
            border
            rounded-2xl
            px-4
            py-3
            outline-none
          "
        />

      </div>

      <div>

        <label
          className="
            text-sm
            font-semibold
            text-gray-600
          "
        >
          Precio
        </label>

        <input
          type="number"
          value={price}
          onChange={(e) =>
            setPrice(
              e.target.value
            )
          }
          placeholder="$"
          className="
            w-full
            mt-2
            border
            rounded-2xl
            px-4
            py-3
            outline-none
          "
        />

      </div>

      <div>

        <label
          className="
            text-sm
            font-semibold
            text-gray-600
          "
        >
          Stock
        </label>

        <input
          type="number"
          value={stock}
          onChange={(e) =>
            setStock(
              e.target.value
            )
          }
          placeholder="0"
          className="
            w-full
            mt-2
            border
            rounded-2xl
            px-4
            py-3
            outline-none
          "
        />

      </div>

      <div className="md:col-span-2">

        <label
          className="
            text-sm
            font-semibold
            text-gray-600
          "
        >
          Imagen del producto
        </label>

        <label
          className="
            mt-2
            border-2
            border-dashed
            rounded-2xl
            p-6
            flex
            flex-col
            items-center
            justify-center
            cursor-pointer
            hover:bg-gray-50
            transition
          "
        >

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImage
            }
            className="hidden"
          />

          <span className="text-4xl">
            🖼️
          </span>

          <p
            className="
              mt-3
              font-semibold
            "
          >
            Cargar desde este dispositivo
          </p>

          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            PNG, JPG o WEBP
          </p>

        </label>

        {image && (

          <img
            src={image}
            alt="preview"
            className="
              mt-4
              w-32
              h-32
              object-cover
              rounded-2xl
              border
            "
          />

        )}

      </div>

      <div className="md:col-span-2">

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            bg-black
            text-white
            py-4
            rounded-2xl
            font-bold
            hover:opacity-90
            transition
          "
        >

          {loading
            ? "Creando..."
            : "Guardar producto"}

        </button>

      </div>

    </form>
  );
}

export default ProductForm;