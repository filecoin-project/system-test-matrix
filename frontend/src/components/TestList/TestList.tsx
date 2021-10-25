import { Grid, Modal } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { AllTestsData, ChartData } from "../../Data";
import { AllTestsTable } from "../AllTestsTable/AllTestsTable";
import { BarChart } from "../BarChart/BarChart";
import { TestDetailsModal } from "../TestDetailsModal/TestDetailsModal";

export const TestList: React.FC = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Wrapper>
      <h2>Filecoin System Tests</h2>

      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <h4>Test kinds</h4>

          <BarChart renderSpecificData data={ChartData} />
        </Grid>

        <Grid item xs={6}>
          <h4>Test status</h4>

          <BarChart renderSpecificData data={ChartData} />
        </Grid>
      </Grid>

      <h4>All Tests</h4>

      <AllTestsTable rows={AllTestsData} onRowClick={() => handleOpen()} />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <TestDetailsModal />
      </Modal>
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
