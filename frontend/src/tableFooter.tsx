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
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  tableRange,
}: FooterProps) {
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setRowsPerPage(value);
    setPage(1); // Reset to first page
  };

  return (
    <div className="pagination-controls mt-4 flex flex-col md:flex-row justify-between items-center gap-2">
      <div>
        <label htmlFor="rowsPerPageNameId" className="mr-2">
          Rows per page:
        </label>
        <select
          id="rowsPerPageNameId"
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="border px-2 py-1 rounded"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  );
}

export default TableFooter;
