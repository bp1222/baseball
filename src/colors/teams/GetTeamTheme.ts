import {createTheme, Theme} from "@mui/material"

import angels from "./angels"
import astros from "./astros"
import athletics from "./athletics"
import bluejays from "./bluejays"
import braves from "./braves"
import brewers from "./brewers"
import cardnials from "./cardnials"
import cubs from "./cubs"
import diamondbacks from "./diamondbacks"
import dodgers from "./dodgers"
import giants from "./giants"
import guardians from "./guardians"
import mariners from "./mariners"
import marlins from "./marlins"
import mets from "./mets"
import nationals from "./nationals"
import orioles from "./orioles"
import padres from "./padres"
import phillies from "./phillies"
import pirates from "./pirates"
import rangers from "./rangers"
import rays from "./rays"
import reds from "./reds"
import redsox from "./redsox"
import rockies from "./rockies"
import royals from "./royals"
import tigers from "./tigers"
import twins from "./twins"
import whitesox from "./whitesox"
import yankees from "./yankees"

const teamColorMap: {[key: number]: Theme} = {
  108: angels,
  109: diamondbacks,
  110: orioles,
  111: redsox,
  112: cubs,
  113: reds,
  114: guardians,
  115: rockies,
  116: tigers,
  117: astros,
  118: royals,
  119: dodgers,
  120: nationals,
  121: mets,
  133: athletics,
  134: pirates,
  135: padres,
  136: mariners,
  137: giants,
  138: cardnials,
  139: rays,
  140: rangers,
  141: bluejays,
  142: twins,
  143: phillies,
  144: braves,
  145: whitesox,
  146: marlins,
  147: yankees,
  158: brewers,
}

export const GetTeamTheme = (teamId: number): Theme => {
  const t: Theme = teamColorMap[teamId]

  return createTheme(
    {
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            "body": {
              backgroundColor: "#f7f7f7",
            },
            "*, *::before, *::after": {
              boxSizing: "initial",
            },
          },
        },
      },
    },
    t ? t : [],
  )
}
