import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

interface HeatMapData {
  date: string;
  count: number;
}

const generateActivityData = (
  startDate: string,
  endDate: string
): HeatMapData[] => {
  const data: HeatMapData[] = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const count = Math.floor(Math.random() * 50);
    data.push({
      date: currentDate.toISOString().split("T")[0],
      count,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
};

const getPanelColors = (maxCount: number) => {
  const colors: Record<number, string> = {};
  for (let i = 0; i <= maxCount; i++) {
    const greenValue = Math.floor((i / maxCount) * 255);
    colors[i] = `rgb(0, ${greenValue}, 0)`;
  }
  return colors;
};

const HeatMapProfile: React.FC = () => {
  const [activityData, setActivityData] = useState<HeatMapData[]>([]);
  const [panelColors, setPanelColors] = useState<Record<number, string>>({});

  useEffect(() => {
    const startDate = "2001-01-01";
    const endDate = "2001-01-31";
    const data = generateActivityData(startDate, endDate);
    setActivityData(data);
    const maxCount = Math.max(...data.map((d) => d.count));
    setPanelColors(getPanelColors(maxCount));
  }, []);

  return (
    <div>
      <h4>Recent Contributions</h4>
      <HeatMap
        value={activityData}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        startDate={new Date("2001-01-01")}
        rectSize={15}
        space={3}
        rectProps={{ rx: 2.5 }}
        panelColors={panelColors}
      />
    </div>
  );
};

export default HeatMapProfile;
