export default function Table({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-200">
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-dark-600 bg-dark-50">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-dark-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b border-dark-100 hover:bg-dark-50 transition ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-sm text-dark-700">
                    {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
