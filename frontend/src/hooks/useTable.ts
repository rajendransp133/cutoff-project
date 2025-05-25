import { CollegeData } from "../assets/tnea_data";
import { useState, useEffect } from "react";

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

const useTable = (data: CollegeData[], page: number, rowsPerPage: number) => {
  const [tableRange, setTableRange] = useState([]);
  const [slice, setSlice] = useState([]);

  useEffect(() => {
    const range: number[] = calculateRange(data, rowsPerPage);
    setTableRange([...range]);

    const slice: CollegeData[] = sliceData(data, page, rowsPerPage);
    setSlice([...slice]);
  }, [data, setTableRange, page, setSlice]);

  return { slice, range: tableRange };
};

export default useTable;
