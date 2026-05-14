/**
 * Convierte un array de objetos a CSV y lo descarga
 * @param {Object[]} data   - array de filas
 * @param {string}   filename - nombre del archivo sin extensión
 */
export function exportToCsv(data, filename = 'reporte') {
    if (!data || data.length === 0) return

    const headers = Object.keys(data[0])

    const csvRows = [
        headers.join(','),
        ...data.map(row =>
            headers.map(h => {
                const val = row[h] ?? ''
                // Si contiene coma o comillas, envolver en comillas
                const escaped = String(val).replace(/"/g, '""')
                return escaped.includes(',') || escaped.includes('\n') ?
                    `"${escaped}"` :
                    escaped
            }).join(',')
        ),
    ]

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.csv`
    link.click()
    URL.revokeObjectURL(url)
}