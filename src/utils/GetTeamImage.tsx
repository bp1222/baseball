export const GetTeamImage = (id: number | undefined, dead?: boolean) => <img
  src = {"https://www.mlbstatic.com/team-logos/team-cap-on-light/" +id + ".svg"}
  style={{
    filter: dead ? "grayscale(1)": '',
  }}
  height = {24}
  width = {24}/>
