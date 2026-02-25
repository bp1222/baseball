import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import LabelPaper from '@/components/Shared/LabelPaper.tsx'

export type ThemedTableData = {
  id: number | string
  data: (string | number | undefined)[]
}

type ThemedTableProps = {
  label: string
  headerRow: string[]
  data: ThemedTableData[]
  highlightRowId?: number | string
}

export const ThemedTable = ({ label, headerRow, data, highlightRowId }: ThemedTableProps) => {
  const headerCellSx = {
    whiteSpace: 'nowrap' as const,
    fontWeight: 700,
    py: 1,
  }
  const isHighlightedRow = (rowId: number | string) => {
    return highlightRowId !== undefined && rowId === highlightRowId
  }

  return (
    <LabelPaper label={label}>
      <TableContainer
        sx={{
          maxHeight: 425,
          overflowX: 'auto',
          overflowY: 'auto',
          '& thead th': {
            position: 'sticky',
            top: 0,
            zIndex: 10,
          },
        }}
      >
        <Table stickyHeader size="small" sx={{ minWidth: 320 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              {headerRow.map((header, idx) => (
                <TableCell sx={headerCellSx} align={idx === 0 ? 'left' : 'right'} key={header}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: isHighlightedRow(row.id) ? 'primary.light' : 'action.hover' },
                  ...(isHighlightedRow(row.id) && {
                    bgcolor: 'primary.main',
                    fontWeight: 'bold',
                  }),
                }}
              >
                {row.data.map((cell, colIdx) => (
                  <TableCell
                    sx={{
                      ...(isHighlightedRow(row.id) && {
                        color: 'primary.contrastText',
                      }),
                    }}
                    align={colIdx === 0 ? 'left' : 'right'}
                    key={colIdx}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </LabelPaper>
  )
}
