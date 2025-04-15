import React, { useEffect, useState } from 'react';

const XpOverTimeGraph = ({ xpData }) => {
  const [totalPoints, setTotalPoints] = useState([]);
  const [tooltipData, setTooltipData] = useState({ visible: false, x: 0, y: 0, data: null });
  
  // Graph dimensions
  const width = 800;
  const height = 400;
  const padding = { top: 40, right: 40, bottom: 80, left: 70 }; // Increased bottom padding
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;
  
  useEffect(() => {
    if (!xpData || xpData.length === 0) return;
    
    // Process XP data to create cumulative points
    const processedData = xpData.reduce((acc, transaction, index) => {
      const date = new Date(transaction.createdAt);
      const prevTotal = index > 0 ? acc[index - 1].totalXp : 0;
      const totalXp = prevTotal + transaction.amount;
      
      acc.push({
        id: transaction.id,
        date,
        xp: transaction.amount,
        totalXp,
        path: transaction.path,
      });
      
      return acc;
    }, []);
    
    setTotalPoints(processedData);
  }, [xpData]);
  
  // Calculate scales
  const getScales = () => {
    if (totalPoints.length === 0) return { xScale: () => 0, yScale: () => 0 };
    
    const xMin = totalPoints[0].date;
    const xMax = totalPoints[totalPoints.length - 1].date;
    const yMax = totalPoints[totalPoints.length - 1].totalXp;
    
    const xScale = (date) => {
      const timeRange = xMax.getTime() - xMin.getTime();
      const percentage = (date.getTime() - xMin.getTime()) / timeRange;
      return padding.left + percentage * graphWidth;
    };
    
    const yScale = (value) => {
      return padding.top + graphHeight - (value / yMax) * graphHeight;
    };
    
    return { xScale, yScale };
  };
  
  const { xScale, yScale } = getScales();
  
  // Generate path for the line
  const generatePath = () => {
    if (totalPoints.length === 0) return '';
    
    let pathData = `M ${xScale(totalPoints[0].date)} ${yScale(totalPoints[0].totalXp)}`;
    
    for (let i = 1; i < totalPoints.length; i++) {
      pathData += ` L ${xScale(totalPoints[i].date)} ${yScale(totalPoints[i].totalXp)}`;
    }
    
    return pathData;
  };
  
  // Generate axes
  const generateAxes = () => {
    if (totalPoints.length === 0) return { xAxisPoints: [], yAxisPoints: [] };
    
    // X-axis: dates - reduce number of labels to prevent overcrowding
    const monthSet = new Set();
    const xAxisPoints = [];
    
    // Calculate approx number of labels that would fit without overlapping
    const maxLabels = Math.floor(graphWidth / 100);
    const skipFactor = Math.ceil(totalPoints.length / maxLabels);
    
    totalPoints.forEach((point, index) => {
      // Only show labels at intervals to prevent overcrowding
      if (index % skipFactor !== 0) return;
      
      const monthYear = `${point.date.getMonth() + 1}/${point.date.getFullYear()}`;
      if (!monthSet.has(monthYear)) {
        monthSet.add(monthYear);
        xAxisPoints.push({
          x: xScale(point.date),
          label: monthYear
        });
      }
    });
    
    // Y-axis: XP values
    const yMax = totalPoints[totalPoints.length - 1].totalXp;
    const yStep = Math.ceil(yMax / 5 / 1000) * 1000;
    const yAxisPoints = [];
    
    for (let i = 0; i <= 5; i++) {
      const value = i * yStep;
      yAxisPoints.push({
        y: yScale(value),
        label: `${value.toLocaleString()} XP`
      });
    }
    
    return { xAxisPoints, yAxisPoints };
  };
  
  const { xAxisPoints, yAxisPoints } = generateAxes();
  
  // Handle mouse hover for tooltips
  const handleMouseOver = (point, index) => {
    setTooltipData({
      visible: true,
      x: xScale(point.date),
      y: yScale(point.totalXp),
      data: {
        date: point.date.toLocaleDateString(),
        xp: point.xp,
        totalXp: point.totalXp,
        path: point.path
      }
    });
  };
  
  const handleMouseOut = () => {
    setTooltipData({ ...tooltipData, visible: false });
  };
  
  if (totalPoints.length === 0) {
    return <div>Loading XP data...</div>;
  }
  
  return (
    <div className="graph-container">
      <h3>XP Progress Over Time</h3>
      <svg width={width} height={height} className="xp-graph">
        {/* Graph title */}
        <text x={width / 2} y={20} textAnchor="middle" className="graph-title">
          XP Earned Over Time
        </text>
        
        {/* X-axis */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#555b73"
          strokeWidth="2"
        />
        
        {/* X-axis labels */}
        {xAxisPoints.map((point, i) => (
          <g key={i}>
            <line
              x1={point.x}
              y1={height - padding.bottom}
              x2={point.x}
              y2={height - padding.bottom + 5}
              stroke="#555b73"
            />
            <text
              x={point.x}
              y={height - padding.bottom + 20}
              textAnchor="end"
              transform={`rotate(-45, ${point.x}, ${height - padding.bottom + 20})`}
              className="axis-label"
              fill="#d0d0d0"
              fontWeight="500"
              fontSize="11"
            >
              {point.label}
            </text>
          </g>
        ))}
        
        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#555b73"
          strokeWidth="2"
        />
        
        {/* Y-axis labels */}
        {yAxisPoints.map((point, i) => (
          <g key={i}>
            <line
              x1={padding.left - 5}
              y1={point.y}
              x2={padding.left}
              y2={point.y}
              stroke="#555b73"
            />
            <text
              x={padding.left - 10}
              y={point.y + 5}
              textAnchor="end"
              className="axis-label"
              fill="#d0d0d0"
              fontWeight="500"
            >
              {point.label}
            </text>
            
            {/* Grid line */}
            <line
              x1={padding.left}
              y1={point.y}
              x2={width - padding.right}
              y2={point.y}
              stroke="#3f4868"
              strokeDasharray="5,5"
            />
          </g>
        ))}
        
        {/* The XP line */}
        <path
          d={generatePath()}
          fill="none"
          stroke="#4CAF50"
          strokeWidth="3"
          className="xp-line"
        />
        
        {/* Data points */}
        {totalPoints.map((point, index) => (
          <circle
            key={point.id}
            cx={xScale(point.date)}
            cy={yScale(point.totalXp)}
            r="4"
            fill="#4CAF50"
            onMouseOver={() => handleMouseOver(point, index)}
            onMouseOut={handleMouseOut}
            className="data-point"
          />
        ))}
        
        {/* Tooltip */}
        {tooltipData.visible && tooltipData.data && (
          <g className="tooltip">
            <rect
              x={tooltipData.x + 10}
              y={tooltipData.y - 70}
              width="180"
              height="65"
              rx="5"
              fill="rgba(40, 44, 63, 0.9)"
              stroke="#4CAF50"
              strokeWidth="1"
            />
            <text x={tooltipData.x + 20} y={tooltipData.y - 50} fill="white" fontWeight="500">
              Date: {tooltipData.data.date}
            </text>
            <text x={tooltipData.x + 20} y={tooltipData.y - 30} fill="white" fontWeight="500">
              XP Earned: {tooltipData.data.xp.toLocaleString()}
            </text>
            <text x={tooltipData.x + 20} y={tooltipData.y - 10} fill="white" fontWeight="500">
              Total XP: {tooltipData.data.totalXp.toLocaleString()}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default XpOverTimeGraph;