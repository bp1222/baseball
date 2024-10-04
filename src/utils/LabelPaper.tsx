import {Divider, Paper, Typography} from "@mui/material"
import {ReactNode} from "react"

type LabelPaperProps = {
  label: string
  children: ReactNode
}

const LabelPaper = ({ label, children }: LabelPaperProps) => {
  return (
    <Paper elevation={2}
           style={{ marginBottom: 12 }}>
      <Typography
        paddingTop={1}
        paddingBottom={1}
        fontWeight={"bold"}
        textAlign={"center"}
        fontSize={"larger"}
        color={"primary.main"}
      >
        {label}
      </Typography>
      <Divider />
      {children}
    </Paper>
  )
}

export default LabelPaper