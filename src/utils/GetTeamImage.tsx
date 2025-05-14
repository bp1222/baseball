import {Team} from "@/types/Team.ts"

export const GetTeamImage = (team?: Team, dead?: boolean) => {
  if (team == undefined) return
  return <img
    src = {"https://www.mlbstatic.com/team-logos/team-cap-on-light/" + team.id + ".svg"}
    style={{
      filter: dead ? "grayscale(1)": '',
    }}
    height = {24}
    width = {24}
    alt={team.name}/>
}
