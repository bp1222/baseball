import {Team} from '@bp1222/stats-api'

export const GetTeamImage = (team: Team, dead?: boolean) => <img
    src = {"https://www.mlbstatic.com/team-logos/team-cap-on-light/" + team.id + ".svg"}
    style={{
      filter: dead ? "grayscale(1)": '',
    }}
    height = {24}
    width = {24}
    alt={team.name}/>
