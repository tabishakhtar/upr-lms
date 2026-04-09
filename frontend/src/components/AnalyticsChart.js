import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

function AnalyticsChart({data}){

 return(

  <BarChart width={400} height={300} data={data}>
   <XAxis dataKey="name" />
   <YAxis />
   <Tooltip />
   <Bar dataKey="value" />
  </BarChart>

 );

}

export default AnalyticsChart;