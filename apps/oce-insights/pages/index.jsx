import styled from '@emotion/styled';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import OceTable from '../components/oce-table/oce-table';

const StyledPage = styled.div`
  .page {
  }
`;

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.@emotion/styled file.
   */
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            oce-insights
          </Typography>
        </Toolbar>
      </AppBar>
      <Box>
        <OceTable />
      </Box>
    </Box>
  );
}

export default Index;
