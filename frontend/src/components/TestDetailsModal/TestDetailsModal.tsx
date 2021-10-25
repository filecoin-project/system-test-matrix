import { Box, Button, Grid } from "@mui/material";
import styled from "styled-components";
import { LinkedBehavoiurData } from "../../Data";
import { LinkedBehavoiursTable } from "../LinkedBehavioursTable/LinkedBehavioursTable";

export const TestDetailsModal: React.FC = () => (
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
        <Header>Test: TestSomething </Header>
        <Button variant="contained" color="success">
          Passing
        </Button>
      </Grid>

      <Grid item xs={6}>
        <div>Repository: system-test-matrix</div>
        <br />
        <div>Tags: #unit</div>
      </Grid>

      <Grid item xs={6}>
        <div>File: fourth-test.go</div>
      </Grid>

      <Grid item xs={12}>
        <div>Linked behaviours</div>

        <LinkedBehavoiursTable rows={LinkedBehavoiurData} />
      </Grid>
    </Grid>
  </Box>
);

const Header = styled.h4`
  margin: 0;
`;
