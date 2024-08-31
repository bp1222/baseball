import { Theme, createTheme } from "@mui/material";
import phillies from "./phillies";
import athletics from "./athletics";
import pirates from "./pirates";
import padres from "./padres";
import mariners from "./mariners";
import giants from "./giants";
import cardnials from "./cardnials";
import rays from "./rays";
import rangers from "./rangers";
import bluejays from "./bluejays";
import twins from "./twins";
import braves from "./braves";
import whitesox from "./whitesox";
import marlins from "./marlins";
import yankees from "./yankees";
import brewers from "./brewers";
import angels from "./angels";
import diamondbacks from "./diamondbacks";
import orioles from "./orioles";
import redsox from "./redsox";
import reds from "./reds";
import cubs from "./cubs";
import guardians from "./guardians";
import rockies from "./rockies";
import tigers from "./tigers";
import astros from "./astros";
import royals from "./royals";
import dodgers from "./dodgers";
import nationals from "./nationals";
import mets from "./mets";

const GetTheme = (teamId: number | undefined): Theme => {
  let t: Theme | undefined = undefined;

  switch (teamId) {
    case 108:
      t = angels;
      break;
    case 109:
      t = diamondbacks;
      break;
    case 110:
      t = orioles;
      break;
    case 111:
      t = redsox;
      break;
    case 112:
      t = cubs;
      break;
    case 113:
      t = reds;
      break;
    case 114:
      t = guardians;
      break;
    case 115:
      t = rockies;
      break;
    case 116:
      t = tigers;
      break;
    case 117:
      t = astros;
      break;
    case 118:
      t = royals;
      break;
    case 119:
      t = dodgers;
      break;
    case 120:
      t = nationals;
      break;
    case 121:
      t = mets;
      break;
    case 133:
      t = athletics;
      break;
    case 134:
      t = pirates;
      break;
    case 135:
      t = padres;
      break;
    case 136:
      t = mariners;
      break;
    case 137:
      t = giants;
      break;
    case 138:
      t = cardnials;
      break;
    case 139:
      t = rays;
      break;
    case 140:
      t = rangers;
      break;
    case 141:
      t = bluejays;
      break;
    case 142:
      t = twins;
      break;
    case 143:
      t = phillies;
      break;
    case 144:
      t = braves;
      break;
    case 145:
      t = whitesox;
      break;
    case 146:
      t = marlins;
      break;
    case 147:
      t = yankees;
      break;
    case 158:
      t = brewers;
      break;
  }

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
  );
};

export default GetTheme;
