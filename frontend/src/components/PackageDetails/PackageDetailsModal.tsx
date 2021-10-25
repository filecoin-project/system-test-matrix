import { Box, Button, Grid } from "@mui/material";
import { useHistory } from "react-router";
import styled from "styled-components";
import { ChartData } from "../../Data";
import { BarChart } from "../BarChart/BarChart";

export const PackageDetailsModal: React.FC = () => {
  const { push } = useHistory();

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600,
        bgcolor: "background.paper",
        boxShadow: 24,
        borderRadius: 1,
        p: 4,
      }}
    >
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Header>Repository: Lotus </Header>
          <Button variant="contained" color="warning" size="small">
            Mediocre
          </Button>
        </Grid>

        <Grid item xs={6}>
          <h4>Test kinds</h4>

          <BarChart data={ChartData} />
        </Grid>

        <Grid item xs={6}>
          <h4>Test kinds</h4>

          <BarChart data={ChartData} />
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            marginTop: 4,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="outlined"
            color="info"
            sx={{ marginRight: 1 }}
            onClick={() => push("/test-list")}
          >
            See all tests
          </Button>
          <Button
            variant="outlined"
            color="info"
            onClick={() => push("/behaviour-list")}
          >
            See all behaviours
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const Header = styled.h4`
  margin: 0;
`;
