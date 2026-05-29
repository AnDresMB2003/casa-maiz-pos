function Table({
  columns,
  data,
  renderRow,
}) {

  return (
    <div
      className="
        overflow-x-auto
        rounded-[28px]
        border
        border-white/[0.06]
        bg-[#111113]
      "
    >

      <table className="w-full">

        <thead
          className="
            border-b
            border-white/[0.06]
          "
        >

          <tr>

            {columns.map((column) => (

              <th
                key={column}
                className="
                  px-6
                  py-5
                  text-left
                  text-sm
                  font-semibold
                  text-gray-400
                "
              >
                {column}
              </th>

            ))}

          </tr>

        </thead>

        <tbody>

          {data.map(renderRow)}

        </tbody>

      </table>

    </div>
  );
}

export default Table;