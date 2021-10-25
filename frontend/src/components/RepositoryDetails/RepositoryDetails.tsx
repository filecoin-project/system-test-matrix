import { Button, Grid, Modal } from "@mui/material";
import { useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { ChartData, RepositoryDetailsData } from "../../Data";
import { BarChart } from "../BarChart/BarChart";
import { MainTable } from "../MainTable/MainTable";
import { PackageDetailsModal } from "../PackageDetails/PackageDetailsModal";

export const RepositoryDetails: React.FC = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { push } = useHistory();

  return (
    <Wrapper>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <h3>Repository: Lotus </h3>

          <Button variant="contained" color="warning">
            Mediocre
          </Button>
        </Grid>
        <Grid item xs={6}>
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

        <Grid item xs={6}>
          <h4>Test kinds</h4>

          <BarChart renderSpecificData data={ChartData} />
        </Grid>

        <Grid item xs={6}>
          <h4>Test Status</h4>

          <BarChart renderSpecificData data={ChartData} />
        </Grid>

        <Grid item xs={12}>
          <h4>Packages in repository ()</h4>
          <MainTable
            onRowClick={() => handleOpen()}
            rows={RepositoryDetailsData}
          />

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <PackageDetailsModal />
          </Modal>
        </Grid>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
