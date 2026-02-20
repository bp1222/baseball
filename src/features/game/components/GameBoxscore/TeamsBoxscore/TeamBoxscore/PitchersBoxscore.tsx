import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import { useModal } from '@/context/ModalContext'
import { BoxscoreTeam } from '@/types/Boxscore'
import { Player } from '@/types/Player'

type PitchersBoxscoreProps = {
  boxscore: BoxscoreTeam
}

export const PitchersBoxscore = ({ boxscore }: PitchersBoxscoreProps) => {
  const { openPlayer } = useModal()

  const getPitcher = (b: Player) => {
    return (
      <TableRow key={boxscore.teamId + '-pitcher-' + b.id}>
        <TableCell>
          <Typography
            component="button"
            sx={{
              border: 0,
              background: 'none',
              padding: 0,
              cursor: 'pointer',
              color: 'primary.main',
              textDecoration: 'underline',
              textUnderlineOffset: 2,
              font: 'inherit',
              '&:hover': { color: 'primary.dark' },
            }}
            onClick={() => openPlayer(b.id)}
          >
            {b.name}
          </Typography>
        </TableCell>
        <TableCell align={'right'} padding={'checkbox'}>
          {b.stats.pitching.inningsPitched}
        </TableCell>
        <TableCell align={'right'} padding={'checkbox'}>
          {b.stats.pitching.hits}
        </TableCell>
        <TableCell align={'right'} padding={'checkbox'}>
          {b.stats.pitching.runs}
        </TableCell>
        <TableCell align={'right'} padding={'checkbox'}>
          {b.stats.pitching.earnedRuns}
        </TableCell>
        <TableCell align={'right'} padding={'checkbox'}>
          {b.stats.pitching.walks}
        </TableCell>
        <TableCell align={'right'} padding={'checkbox'}>
          {b.stats.pitching.strikeouts}
        </TableCell>
        <TableCell align={'right'} padding={'checkbox'}>
          {b.stats.pitching.homeRuns}
        </TableCell>
        <TableCell align={'right'} padding={'checkbox'}>
          {b.stats.pitching.era}
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography>Pitchers</Typography>
        <TableContainer sx={{ overflowX: 'auto', maxWidth: '100%' }}>
          <Table stickyHeader size={'small'} sx={{ minWidth: 360 }}>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align={'right'} padding={'checkbox'}>
                  IP
                </TableCell>
                <TableCell align={'right'} padding={'checkbox'}>
                  H
                </TableCell>
                <TableCell align={'right'} padding={'checkbox'}>
                  R
                </TableCell>
                <TableCell align={'right'} padding={'checkbox'}>
                  ER
                </TableCell>
                <TableCell align={'right'} padding={'checkbox'}>
                  BB
                </TableCell>
                <TableCell align={'right'} padding={'checkbox'}>
                  K
                </TableCell>
                <TableCell align={'right'} padding={'checkbox'}>
                  HR
                </TableCell>
                <TableCell align={'right'} padding={'checkbox'}>
                  ERA
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{boxscore.pitchers.map((b) => getPitcher(boxscore.players[b]))}</TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}
