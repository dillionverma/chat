"use client";

import { Card, LineChart, Subtitle, Title } from "@tremor/react";

const dataFormatter = (number: number) => {
  return "$ " + Intl.NumberFormat("us").format(number).toString();
};

const AILineChart = ({ title, description, data, categories, index }) => (
  <Card>
    <Title>{title}</Title>
    <Subtitle>{description}</Subtitle>
    <LineChart
      className="mt-6"
      data={data}
      index={index}
      categories={categories}
      valueFormatter={dataFormatter}
      colors={["blue"]}
      yAxisWidth={48}
    />
  </Card>
);

export default AILineChart;
