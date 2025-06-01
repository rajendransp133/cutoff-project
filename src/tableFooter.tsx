import { CollegeData } from "./assets/tnea_data";

type FooterProps = {
  data: CollegeData[];
  page: number;
  setPage: (n: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (n: number) => void;
  tableRange: number[];
};

function TableFooter({
  data,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  tableRange,
}: FooterProps) {
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setRowsPerPage(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <div>
        <label htmlFor="rowsPerPageNameId" className="mr-2">
          Rows per page:
        </label>
        <select
          id="rowsPerPageNameId"
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="border px-2 py-1 rounded bg-[rgb(32,28,28)] text-white border-gray-600"
        >
          <option className="bg-[rgb(32,28,28)] text-white" value="10">
            10
          </option>
          <option className="bg-[rgb(32,28,28)] text-white" value="20">
            20
          </option>
          <option className="bg-[rgb(32,28,28)] text-white" value="50">
            50
          </option>
          <option className="bg-[rgb(32,28,28)] text-white" value="100">
            100
          </option>
        </select>
      </div>
      <div className="flex flex-wrap gap-2 ">
        {tableRange.map((range, index) => (
          <button
            key={range}
            onClick={() => setPage(range)}
            className={`w-10 h-10  hover:bg-gray-800 rounded-full cursor-pointer ${
              page === range ? "bg-gray-800 text-white" : ""
            }`}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TableFooter;
