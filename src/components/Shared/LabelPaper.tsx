import {Box, Paper, Typography} from '@mui/material'
import {ReactNode} from 'react'

type LabelPaperProps = {
  label: string
  children: ReactNode
}

const LabelPaper = ({ label, children }: LabelPaperProps) => {
  return (
    <Paper
      elevation={1}
      sx={{
        marginBottom: 2,
        minWidth: 0,
        borderRadius: 1.5,
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          py: 1.25,
          px: 1.5,
          fontWeight: 700,
          textAlign: 'center',
          letterSpacing: '0.02em',
          bgcolor: 'secondary.dark',
          color: 'secondary.contrastText',
        }}
      >
        {label}
      </Typography>
      <Box sx={{ p: 0.5, pt: 1 }}>
        {children}
      </Box>
    </Paper>
  )
}

export default LabelPaper
