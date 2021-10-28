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
import { useHistory } from "react-router";
import styled from "styled-components";
import { TableRowType } from "../../Data";
import { BarChart } from "../BarChart/BarChart";

interface MainTableProps {
  rows: TableRowType[];
  onRowClick?: () => void;
}

export const MainTable: React.FC<MainTableProps> = ({ rows, onRowClick }) => {
  const { push } = useHistory();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Repository</TableCell>
            <TableCell>Test Kinds</TableCell>
            <TableCell>Test Status</TableCell>
            <TableCell>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={`row.projectName-${index}`}
              onClick={() => {
                if (onRowClick) {
                  onRowClick();
                } else {
                  push("/repository-details");
                }
              }}
            >
              <TableCell width={400}>
                <ProjectLinkWrapper>
                  <h4>{row.projectName}</h4>
                  <a href={row.projectURL} target="_blank" rel="noreferrer">
                    {row.projectURL}
                  </a>
                </ProjectLinkWrapper>
              </TableCell>
              <TableCell>
                <BarChart data={row.testKindsData} />
              </TableCell>
              <TableCell>
                <BarChart data={row.testStatusData} />
              </TableCell>

              <TableCell>
                <Button
                  variant="contained"
                  color={
                    row.score === "Good"
                      ? "success"
                      : row.score === "Bad"
                      ? "error"
                      : "warning"
                  }
                >
                  {row.score}
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
