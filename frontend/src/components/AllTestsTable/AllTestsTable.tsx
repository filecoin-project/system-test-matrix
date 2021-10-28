import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import styled from "styled-components";
import { AllTestsRowType } from "../../Data";

interface AllTestsTableProps {
  rows: AllTestsRowType[];
  onRowClick: () => void;
}

export const AllTestsTable: React.FC<AllTestsTableProps> = ({
  rows,
  onRowClick,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Suite</TableCell>
            <TableCell>Function</TableCell>
            <TableCell>Repository</TableCell>
            <TableCell>Kinds (tags)</TableCell>
            <TableCell>Behaviours</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={`all-tests-${index}`} onClick={() => onRowClick()}>
              <TableCell width={400}>
                <ProjectLinkWrapper>
                  <h4>{row.suiteName}</h4>
                  <a href={row.suiteURL} target="_blank" rel="noreferrer">
                    {row.suiteURL}
                  </a>
                </ProjectLinkWrapper>
              </TableCell>

              <TableCell>{row.functionName}</TableCell>

              <TableCell>{row.repositoryName}</TableCell>

              <TableCell>
                {row.tags.map((tag) => (
                  <span>#{tag} </span>
                ))}
              </TableCell>

              <TableCell>
                {row.behaviours.map((tag) => (
                  <span>{tag} </span>
                ))}
              </TableCell>

              <TableCell>
                <Button
                  variant="contained"
                  color={
                    row.status === "Good"
                      ? "success"
                      : row.status === "Bad"
                      ? "error"
                      : "warning"
                  }
                >
                  {row.status}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ProjectLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;

  a {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  h4 {
    margin: 0 0 10px 0;
  }
`;
