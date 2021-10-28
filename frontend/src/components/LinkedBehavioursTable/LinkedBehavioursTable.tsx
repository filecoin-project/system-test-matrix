import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { LinkedBehavoiurRowType } from "../../Data";

type LinkedBehavoiursTableProps = {
  rows: LinkedBehavoiurRowType[];
};

export const LinkedBehavoiursTable: React.FC<LinkedBehavoiursTableProps> = ({
  rows,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={`all-tests-${index}`}
              onClick={() => console.log("TODO")}
            >
              <TableCell>
                <h4>{row.behaviourName}</h4>
              </TableCell>

              <TableCell>
                {row.tags.map((tag) => (
                  <div>{tag}</div>
                ))}
              </TableCell>

              <TableCell>{row.description}</TableCell>

              <TableCell>{row.behaviourURL}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
