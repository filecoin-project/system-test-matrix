import Tooltip from "@mui/material/Tooltip";
import styled from "styled-components";

type DataObject = {
  color: string;
  border: string;
  value: number;
  description: string;
};

interface BarChartProps {
  data: DataObject[];
  renderSpecificData?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  renderSpecificData = false,
}) => {
  const generateItems = () =>
    data.map((item, index) => (
      <Tooltip
        key={`tooltip-${index}`}
        title={item.description}
        onClick={() => console.log("TODO")}
      >
        <BarChartItem
          color={item.color}
          border={item.border}
          value={item.value}
        />
      </Tooltip>
    ));

  const renderSpecificItems = () =>
    data.map((item, index) => (
      <ItemWrapper key={`specificItem-${index}`}>
        <BoxItem color={item.color} border={item.border} value={item.value} />
        {item.description}
      </ItemWrapper>
    ));

  return (
    <Wrapper>
      <BarChartWrapper>{generateItems()}</BarChartWrapper>
      {renderSpecificData && (
        <ChartDescWrapper>{renderSpecificItems()}</ChartDescWrapper>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const BarChartWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 200px;
`;

const ChartDescWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  max-width: 100%;
  flex-wrap: wrap;
`;

const BarChartItem = styled.div<{
  color: string;
  border: string;
  value: number;
}>`
  height: 40px;
  ${(props) =>
    `background-color: ${props.color};
    border: 1px solid ${props.border};
    width: ${props.value}%
  `};
`;

const BoxItem = styled.div<{
  color: string;
  border: string;
  value: number;
}>`
  height: 20px;
  width: 20px;
  margin-right: 10px;

  ${(props) =>
    `background-color: ${props.color};
      border: 1px solid ${props.border};
    `};
`;

const ItemWrapper = styled.div`
  width: 130px;
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 10px;
`;
