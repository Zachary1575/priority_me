import './App.css'
import '@mantine/core/styles.css';
import Priorty from './page/priority'
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({});


function App() {
  return (
    <>
      <MantineProvider theme={theme}>
        <Priorty />
      </MantineProvider>
    </>
  )
}

export default App