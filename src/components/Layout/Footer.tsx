import GitHubIcon from '@mui/icons-material/GitHub'
import { Grid, Typography } from '@mui/material'
import { Link } from '@tanstack/react-router'

import img from '/assets/c.png'

export const Footer = () => {
  return (
    <Grid container justifyContent={'center'}>
      <Grid
        margin={1}
        marginTop={4}
        paddingLeft={1}
        paddingRight={1}
        border={0.5}
        borderRadius={1}
        borderColor={'divider'}
      >
        <Grid>
          <Typography noWrap align={'center'}>
            Made in <img width={12} height={12} src={img} alt={'Colorado Stylized C'} />
          </Typography>
        </Grid>
        <Grid>
          <Typography paddingTop={1} align={'center'}>
            <Link to={`https://github.com/bp1222/baseball`}>
              <GitHubIcon
                sx={[
                  (theme) => ({
                    color: theme.palette.secondary.main,
                    '&:hover': {
                      color: theme.palette.secondary.dark,
                    },
                  }),
                  (theme) =>
                    theme.applyStyles('dark', {
                      color: theme.palette.secondary.main,
                      '&:hover': {
                        color: theme.palette.secondary.light,
                      },
                    }),
                ]}
              />
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}
