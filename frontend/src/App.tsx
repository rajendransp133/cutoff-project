import "./App.css";
import data, { CollegeData } from "./assets/tnea_data";
import TableFooter from "./tableFooter";
import { useState, useEffect } from "react";

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

interface sortObject {
  KeysToSort: string;
  direction: string;
}

const calculateRange = (data: CollegeData[], rowsPerPage: number): number[] => {
  const range: number[] = [];
  const num = Math.ceil(data.length / rowsPerPage);
  for (let i = 1; i <= num; i++) {
    range.push(i);
  }
  return range;
};

const sliceData = (
  data: CollegeData[],
  page: number,
  rowsPerPage: number
): CollegeData[] => {
  return data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
};

function TableRows({ data }: { data: CollegeData[] }) {
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
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [tableRange, setTableRange] = useState<number[]>([]);
  const [slice, setSlice] = useState<CollegeData[]>([]);
  const [sort, setSort] = useState<sortObject>({
    KeysToSort: "OC",
    direction: "desc",
  });

  function TableHeader() {
    return (
      <thead>
        <tr>
          {tableHeaders.map((header) => (
            <th
              key={header}
              scope="col"
              onClick={() => handleHeaderClick(header)}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  function handleHeaderClick(header: string) {
    setSort((prevSort) => ({
      KeysToSort: header,
      direction:
        prevSort.KeysToSort === header
          ? prevSort.direction === "desc"
            ? "asc"
            : "desc"
          : "desc",
    }));
  }
  useEffect(() => {
    const range = calculateRange(data, rowsPerPage);
    const currentSlice = sliceData(data, page, rowsPerPage);
    setTableRange(range);
    setSlice(currentSlice);
  }, [page, rowsPerPage]);

  return (
    <div className="App">
      <h1 className="p-4 text-center font-[Inter_Tight] text-3xl">
        TNEA CUTOFF 2024
      </h1>
      {/* <h3 className="text-center">A cutoff based system </h3> */}
      <div className="table-container p-4">
        <div className="overflow-x-auto">
          <table>
            <TableHeader />
            <TableRows data={slice} />
          </table>
        </div>
        <TableFooter
          data={data}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          tableRange={tableRange}
        />
      </div>
    </div>
  );
}

export default App;
