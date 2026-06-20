import { ReactNode } from 'react'

interface Column {
  header: string
  accessor: string
  cell?: (item: any) => ReactNode
}

interface AdminTableProps {
  columns: Column[]
  data: any[]
  actions?: (item: any) => ReactNode
}

export const AdminTable = ({ columns, data, actions }: AdminTableProps) => {
  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                {col.header}
              </th>
            ))}
            {actions && <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {data.map((item, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {col.cell ? col.cell(item) : item[col.accessor]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {actions(item)}
                </td>
              )}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-8 text-center text-slate-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
