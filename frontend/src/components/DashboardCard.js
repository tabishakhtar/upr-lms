import React from "react";

function DashboardCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow w-60">

      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>

    </div>
  );
}

export default DashboardCard;