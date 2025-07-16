import "./App.css";
import data from "./assets/tnea_data";
import data_rank from "./assets/tnea_data_rank";

import type { CollegeData } from "./assets/tnea_data";
import React, { useState, useMemo, useCallback } from "react";
import {
  HiOutlineSortDescending,
  HiOutlineSortAscending,
} from "react-icons/hi";

// Type definitions
type SortDirection = "asc" | "desc";
type SortKey = (typeof SORT_HEADERS)[number];
type FilterKey =
  | "branchCodes"
  | "collegeCodes"
  | "collegeNames"
  | "branchNames";

interface Sort {
  key: SortKey | "";
  direction: SortDirection;
}

interface Sorts {
  primary: Sort;
  secondary: Sort;
}

interface Filters {
  branchCodes: string[];
  collegeCodes: string[];
  collegeNames: string[];
  branchNames: string[];
}

interface Searches {
  branchCodes: string;
  collegeCodes: string;
  collegeNames: string;
  branchNames: string;
}

interface FilterConfig {
  key: FilterKey;
  label: string;
  dataKey: string;
  placeholder: string;
}

type CollegeDataKey = keyof CollegeData;

const TABLE_HEADERS = [
  "College Code",
  "College Name",
  "Branch Code",
  "Branch Name",
  "OC",
  "BC",
  "BCM",
  "MBC",
  "SC",
  "SCA",
  "ST",
];

const SORT_HEADERS = ["OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"];

const FILTER_CONFIGS: FilterConfig[] = [
  {
    key: "branchCodes",
    label: "Branch Code",
    dataKey: "Branch Code",
    placeholder: "Search branch codes...",
  },
  {
    key: "collegeCodes",
    label: "College Code",
    dataKey: "College Code",
    placeholder: "Search college codes...",
  },
  {
    key: "collegeNames",
    label: "College Name",
    dataKey: "College Name",
    placeholder: "Search college names...",
  },
  {
    key: "branchNames",
    label: "Branch Name",
    dataKey: "Branch Name",
    placeholder: "Search branch names...",
  },
];

// Custom hooks
const usePagination = (data: CollegeData[], rowsPerPage: number) => {
  const [page, setPage] = useState(1);

  const tableRange = useMemo(() => {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [data.length, rowsPerPage]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage]);

  return { page, setPage, tableRange, paginatedData };
};

const useSorting = () => {
  const [sorts, setSorts] = useState<Sorts>({
    primary: { key: "OC", direction: "desc" },
    secondary: { key: "BC", direction: "desc" },
  });

  const updateSort = useCallback((key: SortKey, isPrimary = true) => {
    setSorts((prev) => {
      const target = isPrimary ? "primary" : "secondary";
      const other = isPrimary ? "secondary" : "primary";

      if (prev[other].key === key) {
        return {
          ...prev,
          [target]: { key, direction: prev[target].direction || "desc" },
          [other]: { key: "", direction: "desc" },
        };
      }

      return {
        ...prev,
        [target]: { key, direction: prev[target].direction || "desc" },
      };
    });
  }, []);

  const toggleDirection = useCallback((key: SortKey) => {
    setSorts((prev) => {
      if (prev.primary.key === key) {
        return {
          ...prev,
          primary: {
            ...prev.primary,
            direction: prev.primary.direction === "desc" ? "asc" : "desc",
          },
        };
      }
      if (prev.secondary.key === key) {
        return {
          ...prev,
          secondary: {
            ...prev.secondary,
            direction: prev.secondary.direction === "desc" ? "asc" : "desc",
          },
        };
      }
      return prev;
    });
  }, []);

  return { sorts, updateSort, toggleDirection, setSorts };
};

const useFilters = (data: CollegeData[]) => {
  const [filters, setFilters] = useState<Filters>({
    branchCodes: [],
    collegeCodes: [],
    collegeNames: [],
    branchNames: [],
  });

  const [searches, setSearches] = useState<Searches>({
    branchCodes: "",
    collegeCodes: "",
    collegeNames: "",
    branchNames: "",
  });

  const updateFilter = useCallback((filterKey: FilterKey, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: prev[filterKey].includes(value)
        ? prev[filterKey].filter((item) => item !== value)
        : [...prev[filterKey], value],
    }));
  }, []);

  const clearFilter = useCallback((filterKey: FilterKey) => {
    setFilters((prev) => ({ ...prev, [filterKey]: [] }));
  }, []);

  const removeFilterItem = useCallback(
    (filterKey: FilterKey, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [filterKey]: prev[filterKey].filter((item) => item !== value),
      }));
    },
    []
  );

  const updateSearch = useCallback((searchKey: FilterKey, value: string) => {
    setSearches((prev) => ({ ...prev, [searchKey]: value }));
  }, []);

  // Get unique values for each filter
  const uniqueValues = useMemo(() => {
    const result: Record<FilterKey, string[]> = {
      branchCodes: [],
      collegeCodes: [],
      collegeNames: [],
      branchNames: [],
    };

    FILTER_CONFIGS.forEach((config) => {
      let filtered = data;
      Object.entries(filters).forEach(([key, values]) => {
        if (key !== config.key && values.length > 0) {
          const dataKey = FILTER_CONFIGS.find((c) => c.key === key)?.dataKey;
          if (dataKey) {
            filtered = filtered.filter((item) =>
              values.includes(item[dataKey as keyof CollegeData] as string)
            );
          }
        }
      });

      const unique = [
        ...new Set(
          filtered.map(
            (item) => item[config.dataKey as keyof CollegeData] as string
          )
        ),
      ]
        .sort((a, b) => a.localeCompare(b))
        .filter((value) =>
          value.toLowerCase().includes(searches[config.key].toLowerCase())
        );

      result[config.key] = unique;
    });

    return result;
  }, [data, filters, searches]);

  return {
    filters,
    searches,
    uniqueValues,
    updateFilter,
    clearFilter,
    removeFilterItem,
    updateSearch,
  };
};

// Components
interface SortIconProps {
  direction: SortDirection;
  color?: "blue" | "green";
}

const SortIcon: React.FC<SortIconProps> = ({ direction, color = "blue" }) => {
  const Icon =
    direction === "desc" ? HiOutlineSortDescending : HiOutlineSortAscending;
  const colorClass = color === "blue" ? "text-blue-500" : "text-green-500";
  return <Icon className={colorClass} />;
};

interface SortControlsProps {
  sorts: Sorts;
  updateSort: (key: SortKey, isPrimary?: boolean) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ sorts, updateSort }) => (
  <div className="col-span-full flex flex-wrap gap-4 justify-center bg-[rgb(32,28,28)] p-4 rounded-lg">
    {[
      {
        label: "Primary Sort",
        key: "primary" as const,
        color: "blue" as const,
      },
      {
        label: "Secondary Sort",
        key: "secondary" as const,
        color: "green" as const,
      },
    ].map(({ label, key, color }) => (
      <div key={key} className="flex items-center gap-2">
        <label className="font-medium text-sm">{label}:</label>
        <select
          className="border px-3 py-1 rounded bg-[rgb(32,28,28)] text-white border-gray-600 text-sm"
          value={sorts[key].key || ""}
          onChange={(e) =>
            updateSort(e.target.value as SortKey, key === "primary")
          }
        >
          <option value="">None</option>
          {SORT_HEADERS.filter(
            (h) => key === "primary" || h !== sorts.primary.key
          ).map((header) => (
            <option key={header} value={header}>
              {header}
            </option>
          ))}
        </select>
        <button
          className="p-1 hover:bg-gray-600 rounded"
          title={`Sort ${sorts[key].direction}`}
        >
          <SortIcon direction={sorts[key].direction} color={color} />
        </button>
      </div>
    ))}
  </div>
);

interface FilterCardProps {
  config: FilterConfig;
  filter: string[];
  search: string;
  uniqueValues: string[];
  updateFilter: (filterKey: FilterKey, value: string) => void;
  clearFilter: (filterKey: FilterKey) => void;
  removeFilterItem: (filterKey: FilterKey, value: string) => void;
  updateSearch: (searchKey: FilterKey, value: string) => void;
}

const FilterCard: React.FC<FilterCardProps> = ({
  config,
  filter,
  search,
  uniqueValues,
  updateFilter,
  clearFilter,
  removeFilterItem,
  updateSearch,
}) => (
  <div className="flex flex-col gap-3 bg-[rgb(32,28,28)] p-4 rounded-lg shadow-lg">
    <label className="font-medium text-sm text-gray-100">
      {config.label} Filter
    </label>

    {/* Selected items display */}
    <div className="flex flex-wrap gap-2 min-h-[42px] px-3 py-2 rounded-md border border-gray-700 bg-[rgb(32,28,28)] text-white cursor-text focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
      {filter.length === 0 ? (
        <span className="text-gray-400 select-none bg-gray-800/50 px-3 py-1.5 rounded-md border border-gray-700 text-sm hover:bg-gray-800/70 transition-colors">
          Select {config.label.toLowerCase()}s...
        </span>
      ) : (
        filter.map((item) => (
          <div
            key={item}
            className="flex items-center gap-1.5 bg-blue-600 rounded-md px-2.5 py-1 text-sm font-medium shadow-sm"
          >
            <span>{item}</span>
            <button
              type="button"
              onClick={() => removeFilterItem(config.key, item)}
              className="hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-0.5 transition-colors"
              aria-label={`Remove ${item}`}
            >
              &times;
            </button>
          </div>
        ))
      )}
    </div>

    {/* Search and options */}
    <input
      type="text"
      placeholder={config.placeholder}
      value={search}
      onChange={(e) => updateSearch(config.key, e.target.value)}
      className="w-full px-3 py-2 rounded-md border border-gray-700 bg-[rgb(32,28,28)] text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
    />

    <div className="border rounded-md bg-[rgb(32,28,28)] text-white border-gray-700 text-sm h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      {uniqueValues.map((value) => (
        <div
          key={value}
          onClick={() => updateFilter(config.key, value)}
          className={`px-3 py-2 cursor-pointer hover:bg-gray-700 transition-colors ${
            filter.includes(value) ? "bg-blue-600 hover:bg-blue-700" : ""
          }`}
          role="option"
          aria-selected={filter.includes(value)}
        >
          {value}
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
      <div className="font-medium">{filter.length} selected</div>
      <button
        type="button"
        onClick={() => clearFilter(config.key)}
        className="text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={filter.length === 0}
      >
        Clear All
      </button>
    </div>
  </div>
);

interface TableHeaderProps {
  sorts: Sorts;
  toggleDirection: (key: SortKey) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  sorts,
  toggleDirection,
}) => (
  <thead>
    <tr>
      {TABLE_HEADERS.map((header) => (
        <th
          key={header}
          className={`text-center ${
            SORT_HEADERS.includes(header)
              ? "cursor-pointer hover:bg-gray-700"
              : ""
          }`}
          onClick={() =>
            SORT_HEADERS.includes(header)
              ? toggleDirection(header as SortKey)
              : null
          }
        >
          <div className="flex justify-center items-center gap-2 w-full h-full p-2">
            <span className="leading-none">{header}</span>
            {sorts.primary.key === header && (
              <SortIcon direction={sorts.primary.direction} color="blue" />
            )}
            {sorts.secondary.key === header && (
              <SortIcon direction={sorts.secondary.direction} color="green" />
            )}
          </div>
        </th>
      ))}
    </tr>
  </thead>
);

interface TableRowsProps {
  data: CollegeData[];
}

const TableRows: React.FC<TableRowsProps> = ({ data }) => (
  <tbody>
    {data.map((row) => (
      <tr key={`${row["College Code"]}-${row["Branch Code"]}`}>
        {TABLE_HEADERS.map((key) => (
          <td key={key}>{row[key as CollegeDataKey] ?? "-"}</td>
        ))}
      </tr>
    ))}
  </tbody>
);

// Extracted Table Section
const TNEATableSection: React.FC<{ dataType: "cutoff" | "rank" }> = ({
  dataType,
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const currentData = dataType === "cutoff" ? data : data_rank;
  const { sorts, updateSort, toggleDirection, setSorts } = useSorting();
  const {
    filters,
    searches,
    uniqueValues,
    updateFilter,
    clearFilter,
    removeFilterItem,
    updateSearch,
  } = useFilters(currentData);

  // Apply filters and sorting
  const processedData = useMemo(() => {
    let result = [...currentData];

    // Apply filters
    Object.entries(filters).forEach(([filterKey, selectedValues]) => {
      if (selectedValues.length > 0) {
        const dataKey = FILTER_CONFIGS.find(
          (config) => config.key === filterKey
        )?.dataKey;
        if (dataKey) {
          result = result.filter((item) =>
            selectedValues.includes(
              item[dataKey as keyof CollegeData] as string
            )
          );
        }
      }
    });

    // Apply sorting
    result.sort((a, b) => {
      const compareValues = (key: string, direction: SortDirection) => {
        const valA = parseFloat(
          (a[key as keyof CollegeData] as string) ?? "999999"
        );
        const valB = parseFloat(
          (b[key as keyof CollegeData] as string) ?? "999999"
        );

        if (isNaN(valA) && isNaN(valB)) return 0;
        if (isNaN(valA)) return 1;
        if (isNaN(valB)) return -1;

        return direction === "asc" ? valA - valB : valB - valA;
      };

      // Primary sort
      if (sorts.primary.key) {
        const primaryResult = compareValues(
          sorts.primary.key,
          sorts.primary.direction
        );
        if (primaryResult !== 0) return primaryResult;
      }

      // Secondary sort
      if (sorts.secondary.key) {
        return compareValues(sorts.secondary.key, sorts.secondary.direction);
      }

      return 0;
    });

    return result;
  }, [filters, sorts, currentData]);

  const { page, setPage, tableRange, paginatedData } = usePagination(
    processedData,
    rowsPerPage
  );

  // Reset sorts when switching dataType
  React.useEffect(() => {
    setSorts({
      primary: { key: "OC", direction: "desc" },
      secondary: { key: "BC", direction: "desc" },
    });
  }, [dataType, setSorts]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Controls */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SortControls sorts={sorts} updateSort={updateSort} />

          {FILTER_CONFIGS.map((config) => (
            <FilterCard
              key={config.key}
              config={config}
              filter={filters[config.key]}
              search={searches[config.key]}
              uniqueValues={uniqueValues[config.key]}
              updateFilter={updateFilter}
              clearFilter={clearFilter}
              removeFilterItem={removeFilterItem}
              updateSearch={updateSearch}
            />
          ))}
        </div>

        <div className="mt-4 text-xs text-gray-400 text-center">
          <span>Click column headers to sort</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full border-collapse border border-gray-600 text-sm">
            <TableHeader sorts={sorts} toggleDirection={toggleDirection} />
            <TableRows data={paginatedData} />
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <div>
          <label className="mr-2">Rows per page:</label>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setPage(1);
            }}
            className="border px-2 py-1 rounded bg-[rgb(32,28,28)] text-white border-gray-600"
          >
            {[10, 20, 50, 100].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {tableRange.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`w-10 h-10 hover:bg-gray-800 rounded-full cursor-pointer ${
                page === pageNum ? "bg-gray-800 text-white" : ""
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main component
const TNEACutoffTable: React.FC = () => {
  const [dataType, setDataType] = useState<"cutoff" | "rank">("cutoff");

  return (
    <div className="min-h-screen bg-[rgb(16,20,20)] text-white p-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
        <h1 className="text-center font-bold text-3xl">TNEA CUTOFF 2024</h1>
        <select
          className="ml-0 md:ml-6 px-3 py-2 rounded bg-[rgb(32,28,28)] text-white border border-gray-600 text-base font-medium"
          value={dataType}
          onChange={(e) => setDataType(e.target.value as "cutoff" | "rank")}
          style={{ minWidth: 120 }}
        >
          <option value="cutoff">Cutoff</option>
          <option value="rank">Rank</option>
        </select>
      </div>
      {/* Key prop ensures remount on dataType change */}
      <TNEATableSection key={dataType} dataType={dataType} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        body {
          background-color: rgb(16, 20, 20);
          color: white;
          font-family: "Inter", sans-serif;
          margin: 0;
          padding: 0;
        }

        table {
          border-collapse: collapse;
          width: 100%;
        }

        th,
        td {
          padding: 0.5rem;
          color: rgba(255, 255, 255, 0.87);
          font-size: 0.875rem;
          letter-spacing: 0.01071em;
        }

        td {
          background-color: rgb(32, 28, 28);
          text-align: center;
        }

        th {
          position: relative;
          background-color: rgb(24, 20, 20);
          font-weight: normal;
          color: white;
        }

        th::after {
          content: "";
          position: absolute;
          top: 10px;
          bottom: 10px;
          right: 0;
          width: 2px;
          background-color: #ccc;
        }
      `,
        }}
      />
    </div>
  );
};

export default TNEACutoffTable;
