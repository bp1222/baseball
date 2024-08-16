import { useCallback, useContext, useEffect } from 'react';
import { MlbApi } from './services/client-api';
import { Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';

import { AppStateAction, AppStateContext } from './AppContext';
import Header from './components/Header';
import TeamSchedule from './components/TeamSchedule';

import './App.css'

const api = new MlbApi()

function App() {
  const { dispatch } = useContext(AppStateContext)

  const initialLoadState = useCallback(async () => {
    const seasons = await api.getSeasons({ sportId: 1 })
    const teams = await api.getTeams({ sportId: 1 })

    const curSeason = seasons.seasons?.find((s) => s.seasonId == ((new Date()).getFullYear() as unknown as string) ? s : null)
    if (curSeason) {
      dispatch({
        type: AppStateAction.Season,
        season: curSeason,
      })
    }

    dispatch({
      type: AppStateAction.Seasons,
      seasons: seasons.seasons?.reverse() ?? []
    })
    dispatch({
      type: AppStateAction.Teams,
      teams: teams.teams?.sort((a, b) => a.name!.localeCompare(b.name!)) ?? []
    })
  }, [])

  useEffect(() => {
    initialLoadState()
  }, [])

  return (
    <Routes>
      <Route path="/" element={
        <Container  fixed={true} maxWidth="md">
          <Header />
          <TeamSchedule />
        </Container>
      } />
    </Routes>
  )
}

export default App
