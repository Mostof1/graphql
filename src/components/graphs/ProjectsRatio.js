import React, { useEffect, useState } from 'react';

const ProjectsRatioGraph = ({ projectsData }) => {
  const [chartData, setChartData] = useState({ passed: 0, failed: 0, projects: [] });
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  
  // SVG dimensions
  const width = 600;
  const height = 500;
  const radius = Math.min(width, height) / 2 - 40;
  const centerX = width / 2;
  const centerY = height / 2;
  
  useEffect(() => {
    if (!projectsData || projectsData.length === 0) return;
    
    // Process project data and count passes/fails
    const processedData = projectsData.reduce((acc, project) => {
      if (project.object && project.object.type === 'project') {
        const isPassed = project.grade > 0;
        
        // Increment counters
        if (isPassed) {
          acc.passed += 1;
        } else {
          acc.failed += 1;
        }
        
        // Add to projects list
        acc.projects.push({
          id: project.id,
          name: project.object.name || `Project #${project.objectId}`,
          path: project.path,
          passed: isPassed,
          grade: project.grade
        });
      }
      return acc;
    }, { passed: 0, failed: 0, projects: [] });
    
    setChartData(processedData);
  }, [projectsData]);
  
  // Calculate the pie slices
  const calculatePieSlices = () => {
    const total = chartData.passed + chartData.failed;
    if (total === 0) return [];
    
    const slices = [
      { label: 'Passed', value: chartData.passed, color: '#4CAF50', startAngle: 0 },
      { label: 'Failed', value: chartData.failed, color: '#FF5252', startAngle: 0 }
    ];
    
    // Calculate angles
    let currentAngle = 0;
    
    slices.forEach(slice => {
      slice.startAngle = currentAngle;
      slice.percentage = (slice.value / total) * 100;
      slice.angle = (slice.percentage / 100) * Math.PI * 2;
      currentAngle += slice.angle;
    });
    
    return slices;
  };
  
  const slices = calculatePieSlices();
  
  // Function to calculate arc path
  const describeArc = (slice) => {
    if (!slice.angle) return '';
    
    const endAngle = slice.startAngle + slice.angle;
    
    const startX = centerX + radius * Math.cos(slice.startAngle - Math.PI / 2);
    const startY = centerY + radius * Math.sin(slice.startAngle - Math.PI / 2);
    
    const endX = centerX + radius * Math.cos(endAngle - Math.PI / 2);
    const endY = centerY + radius * Math.sin(endAngle - Math.PI / 2);
    
    const largeArcFlag = slice.angle > Math.PI ? 1 : 0;
    
    return `M ${centerX} ${centerY} 
            L ${startX} ${startY} 
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} 
            Z`;
  };
  
  // Handle slice click for more details
  const handleSliceClick = (slice) => {
    if (selectedSlice && selectedSlice.label === slice.label) {
      setSelectedSlice(null);
    } else {
      setSelectedSlice(slice);
    }
  };
  
  // Handle mouse over for highlighting
  const handleMouseOver = (slice) => {
    setHoveredSegment(slice.label);
  };
  
  const handleMouseOut = () => {
    setHoveredSegment(null);
  };
  
  // Get slice label position
  const getLabelPosition = (slice) => {
    if (!slice.angle) return { x: 0, y: 0 };
    
    const midAngle = slice.startAngle + slice.angle / 2 - Math.PI / 2;
    const labelRadius = radius * 0.7;
    
    return {
      x: centerX + labelRadius * Math.cos(midAngle),
      y: centerY + labelRadius * Math.sin(midAngle)
    };
  };
  
  // Get legend for projects list
  const renderProjectsList = () => {
    if (!selectedSlice) return null;
    
    const filteredProjects = chartData.projects.filter(project => 
      (selectedSlice.label === 'Passed' && project.passed) || 
      (selectedSlice.label === 'Failed' && !project.passed)
    );
    
    return (
      <div className="projects-list">
        <h4>{selectedSlice.label} Projects ({filteredProjects.length})</h4>
        <ul>
          {filteredProjects.map(project => (
            <li key={project.id}>
              {project.name} - {project.path} 
              {project.grade !== undefined && ` (Grade: ${project.grade})`}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  // If no data yet
  if (chartData.passed === 0 && chartData.failed === 0) {
    return <div>Loading projects data...</div>;
  }
  
  return (
    <div className="graph-container project-ratio-container">
      <h3>Projects Success Ratio</h3>
      
      <div className="project-ratio-content">
        <svg width={width} height={height} className="project-ratio-graph">
          {/* Graph title */}
          <text x={width / 2} y={30} textAnchor="middle" className="graph-title">
            Project PASS/FAIL Ratio
          </text>
          
          {/* Pie chart slices */}
          {slices.map((slice, index) => (
            <g key={index} 
               className="pie-slice"
               onClick={() => handleSliceClick(slice)}
               onMouseOver={() => handleMouseOver(slice)}
               onMouseOut={handleMouseOut}>
              <path
                d={describeArc(slice)}
                fill={slice.color}
                stroke="#2d3348"
                strokeWidth="2"
                opacity={hoveredSegment === slice.label || selectedSlice?.label === slice.label ? 1 : 0.8}
                transform={
                  hoveredSegment === slice.label || selectedSlice?.label === slice.label 
                    ? `translate(${Math.cos((slice.startAngle + slice.angle/2) - Math.PI/2) * 10}, 
                                ${Math.sin((slice.startAngle + slice.angle/2) - Math.PI/2) * 10})`
                    : ''
                }
              />
              
              {/* Slice label */}
              <text
                x={getLabelPosition(slice).x}
                y={getLabelPosition(slice).y}
                textAnchor="middle"
                fill="#fff"
                fontWeight="bold"
                className="pie-label"
              >
                {slice.label}: {slice.percentage.toFixed(1)}%
              </text>
            </g>
          ))}
          
          {/* Legend */}
          <g className="chart-legend" transform={`translate(${width - 150}, 50)`}>
            {slices.map((slice, index) => (
              <g key={index} transform={`translate(0, ${index * 25})`}>
                <rect width="15" height="15" fill={slice.color} />
                <text x="25" y="12" className="legend-text" fill="#d0d0d0">
                  {slice.label} ({slice.value})
                </text>
              </g>
            ))}
          </g>
          
          {/* Center circle (decorative) */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.3}
            fill="#222639"
            stroke="#3f4868"
            strokeWidth="1"
          />
          
          {/* Total count in center */}
          <text
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            className="total-count"
            fill="#b0b0b0"
          >
            Total Projects
          </text>
          <text
            x={centerX}
            y={centerY + 20}
            textAnchor="middle"
            fontWeight="bold"
            fontSize="24"
            className="total-count-number"
            fill="#ffffff"
          >
            {chartData.passed + chartData.failed}
          </text>
        </svg>
        
        {/* Show selected projects list */}
        {selectedSlice && renderProjectsList()}
      </div>
    </div>
  );
};

export default ProjectsRatioGraph;