import { Box, Paper, Typography } from "@mui/material"
import { ReactNode } from "react"

type LabelPaperProps = {
  label: string
  children: ReactNode
}

const LabelPaper = ({ label, children }: LabelPaperProps) => {
  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        marginBottom: 2,
        minWidth: 0,
        borderRadius: 1.5,
        overflow: "hidden",
        borderColor: "divider",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          py: 1.25,
          px: 1.5,
          fontWeight: 700,
          textAlign: "center",
          color: "primary.main",
          bgcolor: "primary.50",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </Typography>
      <Box sx={{ p: 1.5, pt: 1 }}>{children}</Box>
    </Paper>
  )
}

export default LabelPaper