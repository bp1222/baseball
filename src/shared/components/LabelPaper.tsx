import { Box, Paper, Typography, useTheme } from '@mui/material'
import { ReactNode } from 'react'

type LabelPaperProps = {
  label: string
  children: ReactNode
}

const LabelPaper = ({ label, children }: LabelPaperProps) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        marginBottom: 2,
        minWidth: 0,
        borderRadius: 1.5,
        overflow: 'hidden',
        borderColor: 'divider',
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
          ...(isDark
            ? { bgcolor: 'primary.dark', color: 'primary.contrastText' }
            : { bgcolor: 'primary.50', color: 'primary.main' }),
        }}
      >
        {label}
      </Typography>
      <Box sx={{ p: 1.5, pt: 1 }}>{children}</Box>
    </Paper>
  )
}

export default LabelPaper
