import React, { useState, useEffect } from "react";
import {
  csv,
  scaleTime,
  scaleBand,
  scaleLinear,
  max,
  extent,
  timeFormat,
  format,
} from "d3";

import { csvUrl } from "./csvUrl"

import "./style.css";


const width = 960;
const height = 500;

const margin = {
  top: 20,
  right: 30,
  bottom: 65,
  left: 90,
};

export const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const row = (d) => {
      d.Population = +d['2020'];
      return d;
    };
    csv(csvUrl, row).then(data => {
      setData(data.slice(0,5))
    });
  }, []);

  if (!data) {
    return <pre>Loading...</pre>;
  }

  console.log(data[0]);

  //const xTicksFormat = timeFormat("%Y");

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const xValue = (d) => d.Country;
  const xScale = scaleBand()
    .domain(data.map(xValue))
    .range([0, innerWidth])
    .padding(0.1)



  const yValue = d => d.Population
  const yScale = scaleLinear()
    .domain([0, max(data, yValue)])
    .range([0, innerHeight])

  const tickOffset = 0;

  console.log(yScale.ticks());
  //console.log(yScale.bandwidth())
  //console.log(xScale(data[0].date))
  return (
    <>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>


          {/*X axis*/}
          {xScale.domain().map(tickValue => (
            <text
              style={{textAnchor: "middle"}}
              x={xScale(tickValue) + xScale.bandwidth() / 2}
              y={innerHeight + 15}
            >{tickValue}</text>
          ))}



          {/*Y axis*/}
          {yScale.ticks().map(tickValue => (
            <g transform={`translate(0, ${innerHeight - yScale(tickValue)})`}> 
              <line
                x2={innerWidth}
                stroke="black"
                />
              <text
                style={{ textAnchor: 'end' }}
                dy=".32em"
                x={-2}
              >
                {format(".2s")(tickValue)}
              </text>
            </g>
          ))}


          
          {/*marks*/}
          {data.map(d => (
            <rect 
              key={d.Country} 
              x={xScale(d.Country)} 
              y={innerHeight - yScale(d.Population)} 
              width={xScale.bandwidth()} 
              height={yScale(d.Population)} />
          ))}

          </g>
      </svg>
    </>
  );
};
