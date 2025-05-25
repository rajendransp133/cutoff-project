// import { useState } from "react";
import "./App.css";
import data, { CollegeData } from "./assets/tnea_data";

const tableHeaders = [
  "College Code",
  "College Name",
  "Branch Code",
  "Branch Name",
  "OC",
  "BC",
  "BCM",
  "MBC",
  "MBCDNC",
  "MBCV",
  "SC",
  "SCA",
  "ST",
];

function TableHeader() {
  return (
    <thead>
      <tr>
        {tableHeaders.map((header) => (
          <th key={header} scope="col">
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TableRows() {
  return (
    <tbody>
      {data.map((row: CollegeData) => (
        <tr key={`${row["College Code"]}-${row["Branch Code"]}`}>
          {tableHeaders.map((key) => (
            <td key={key}>{row[key as keyof CollegeData] ?? "-"}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

function App() {
  return (
    <div className="App">
      <h1 className="p-4 text-center font-[Inter_Tight] text-3xl">
        TNEA CUTOFF 2024
      </h1>
      <hr className="mx-4" />
      <div className="table-container p-4">
        <div className="overflow-x-auto">
          <table>
            <TableHeader />
            <TableRows />
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
