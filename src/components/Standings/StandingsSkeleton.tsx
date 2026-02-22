import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import LabelPaper from '@/components/Shared/LabelPaper'

type StandingsSkeletonProps = {
  label: string
  rows?: number
}

export const StandingsSkeleton = ({ label, rows = 5 }: StandingsSkeletonProps) => (
  <LabelPaper label={label}>
    <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 425 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="left">Team</TableCell>
            <TableCell align="right">W</TableCell>
            <TableCell align="right">L</TableCell>
            <TableCell align="right">Pct</TableCell>
            <TableCell align="right">GB</TableCell>
            <TableCell align="right">E#</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              <TableCell align="left">
                <Skeleton variant="text" width={100} height={20} />
              </TableCell>
              <TableCell align="right">
                <Skeleton variant="text" width={24} height={20} sx={{ ml: 'auto' }} />
              </TableCell>
              <TableCell align="right">
                <Skeleton variant="text" width={24} height={20} sx={{ ml: 'auto' }} />
              </TableCell>
              <TableCell align="right">
                <Skeleton variant="text" width={36} height={20} sx={{ ml: 'auto' }} />
              </TableCell>
              <TableCell align="right">
                <Skeleton variant="text" width={28} height={20} sx={{ ml: 'auto' }} />
              </TableCell>
              <TableCell align="right">
                <Skeleton variant="text" width={28} height={20} sx={{ ml: 'auto' }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </LabelPaper>
)
