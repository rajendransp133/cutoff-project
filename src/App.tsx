import "./App.css";
import data from "./assets/tnea_data";

import type { CollegeData } from "./assets/tnea_data";
import TableFooter from "./tableFooter";
import { useState, useEffect } from "react";
import {
  HiOutlineSortDescending,
  HiOutlineSortAscending,
} from "react-icons/hi";

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

const sortHeader = [
  "OC",
  "BC",
  "BCM",
  "MBC",
  "MBCDNC",
  "MBCV",
  "SC",
  "SCA",
  "ST",
] as const;

type SortHeader = (typeof sortHeader)[number];

interface sortObject {
  KeysToSort?: SortHeader | "";
  direction?: "asc" | "desc" | "";
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
  const [sortTwo, setSortTwo] = useState<sortObject>({
    KeysToSort: "BC",
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
              className={`text-center ${
                sortHeader.includes(header as SortHeader)
                  ? "cursor-pointer hover:bg-gray-700"
                  : ""
              }`}
              onClick={() =>
                sortHeader.includes(header as SortHeader)
                  ? handleHeaderClick(header as SortHeader)
                  : null
              }
            >
              <div className="flex justify-center items-center gap-2 w-full h-full p-2">
                <span className="leading-none">{header}</span>
                {sort.KeysToSort === header &&
                  (sort.direction === "desc" ? (
                    <HiOutlineSortDescending className="text-blue-500" />
                  ) : (
                    <HiOutlineSortAscending className="text-blue-500" />
                  ))}
                {sortTwo.KeysToSort === header &&
                  (sortTwo.direction === "desc" ? (
                    <HiOutlineSortDescending className="text-green-500" />
                  ) : (
                    <HiOutlineSortAscending className="text-green-500" />
                  ))}
              </div>
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  function handleHeaderClick(header: SortHeader) {
    // Check if this header is currently the primary sort
    if (sort.KeysToSort === header) {
      setSort((prevSort) => ({
        KeysToSort: header,
        direction: prevSort.direction === "desc" ? "asc" : "desc",
      }));
      return;
    }

    // Check if this header is currently the secondary sort
    if (sortTwo.KeysToSort === header) {
      setSortTwo((prevSortTwo) => ({
        KeysToSort: header,
        direction: prevSortTwo.direction === "desc" ? "asc" : "desc",
      }));
      return;
    }

    // If header is not currently sorted, do nothing
    // Users must use dropdowns to set new sorts
  }

  function handleDropdownSort(header: SortHeader, isPrimary: boolean = true) {
    if (isPrimary) {
      setSort({
        KeysToSort: header,
        direction: sort.direction || "desc",
      });
    } else {
      setSortTwo({
        KeysToSort: header,
        direction: sortTwo.direction || "desc",
      });
    }
  }

  useEffect(() => {
    let sortedData = [...data];

    const primaryKey = sort.KeysToSort;
    const secondaryKey = sortTwo.KeysToSort;

    // Prevent duplicates - if same key is selected for both, use only primary
    if (primaryKey && secondaryKey && primaryKey === secondaryKey) {
      sortedData.sort((a, b) => {
        const valA = parseFloat(a[primaryKey] ?? "999999"); // Use high number for missing cutoffs
        const valB = parseFloat(b[primaryKey] ?? "999999");

        // Handle non-numeric values
        if (isNaN(valA) && isNaN(valB)) return 0;
        if (isNaN(valA)) return 1; // Move non-numeric to end
        if (isNaN(valB)) return -1;

        return sort.direction === "asc" ? valA - valB : valB - valA;
      });
    } else {
      sortedData.sort((a, b) => {
        // Primary sort
        const valA1 = primaryKey
          ? parseFloat(a[primaryKey] ?? "999999")
          : 999999;
        const valB1 = primaryKey
          ? parseFloat(b[primaryKey] ?? "999999")
          : 999999;

        // Handle non-numeric values for primary sort
        if (isNaN(valA1) && isNaN(valB1)) {
          // If both are non-numeric, proceed to secondary sort
        } else if (isNaN(valA1)) {
          return 1;
        } else if (isNaN(valB1)) {
          return -1;
        } else if (valA1 !== valB1) {
          return sort.direction === "asc" ? valA1 - valB1 : valB1 - valA1;
        }

        // Secondary sort (when primary values are equal or both non-numeric)
        if (secondaryKey) {
          const valA2 = parseFloat(a[secondaryKey] ?? "999999");
          const valB2 = parseFloat(b[secondaryKey] ?? "999999");

          if (isNaN(valA2) && isNaN(valB2)) return 0;
          if (isNaN(valA2)) return 1;
          if (isNaN(valB2)) return -1;

          return sortTwo.direction === "asc" ? valA2 - valB2 : valB2 - valA2;
        }

        return 0;
      });
    }

    const currentSlice = sliceData(sortedData, page, rowsPerPage);
    const range = calculateRange(sortedData, rowsPerPage);
    setSlice(currentSlice);
    setTableRange(range);
  }, [sort, sortTwo, page, rowsPerPage]);

  return (
    <div className="App">
      <h1 className="p-4 text-center font-[Inter_Tight] text-3xl">
        TNEA CUTOFF 2024
      </h1>

      <div className="table-container p-4">
        <div className="mb-4 p-4  rounded-lg">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <label htmlFor="sort1Id" className="font-medium text-sm">
                Primary Sort:
              </label>
              <select
                id="sort1Id"
                className="border px-3 py-1 rounded bg-[rgb(32,28,28)] text-white border-gray-600 text-sm"
                value={sort.KeysToSort || ""}
                onChange={(e) =>
                  handleDropdownSort(e.target.value as SortHeader, true)
                }
              >
                <option value="">None</option>
                {sortHeader.map((header) => (
                  <option
                    key={header}
                    className="bg-[rgb(32,28,28)]"
                    value={header}
                  >
                    {header}
                  </option>
                ))}
              </select>
              <button
                className="p-1 hover:bg-gray-600 rounded text-blue-500"
                title={`Sort ${
                  sort.direction === "desc" ? "Descending" : "Ascending"
                }`}
              >
                {sort.direction === "desc" ? (
                  <HiOutlineSortDescending />
                ) : (
                  <HiOutlineSortAscending />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort2Id" className="font-medium text-sm">
                Secondary Sort:
              </label>
              <select
                id="sort2Id"
                className="border px-3 py-1 rounded bg-[rgb(32,28,28)] text-white border-gray-600 text-sm"
                value={sortTwo.KeysToSort || ""}
                onChange={(e) =>
                  handleDropdownSort(e.target.value as SortHeader, false)
                }
              >
                <option value="">None</option>
                {sortHeader
                  .filter((h) => h !== sort.KeysToSort)
                  .map((header) => (
                    <option
                      key={header}
                      className="bg-[rgb(32,28,28)]"
                      value={header}
                    >
                      {header}
                    </option>
                  ))}
              </select>
              <button
                className="p-1 hover:bg-gray-600 rounded text-green-500"
                title={`Sort ${
                  sortTwo.direction === "desc" ? "Descending" : "Ascending"
                }`}
              >
                {sortTwo.direction === "desc" ? (
                  <HiOutlineSortDescending />
                ) : (
                  <HiOutlineSortAscending />
                )}
              </button>
            </div>
          </div>

          {/* Sort Legend */}
          <div className="mt-2 text-xs text-gray-400">
            <span>Click column headers to sort</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-600">
            <TableHeader />
            <TableRows data={slice} />
          </table>
        </div>

        <TableFooter
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
