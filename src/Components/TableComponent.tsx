import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "./ui/button";

interface CommentData {
  postId: number;
  name: string;
  email: string;
  comment: string;
}

type SortKey = keyof CommentData | "";

const TableComponent: React.FC = () => {
  const [data, setData] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Table state
  const [search, setSearch] = useState(() => localStorage.getItem("search") || "");
  const [sortKey, setSortKey] = useState<SortKey>(() => (localStorage.getItem("sortKey") as SortKey) || "");
  const [sortAsc, setSortAsc] = useState(() => localStorage.getItem("sortAsc") === "false" ? false : true);
  const [currentPage, setCurrentPage] = useState(() => Number(localStorage.getItem("currentPage")) || 1);
  const [itemsPerPage, setItemsPerPage] = useState(() => Number(localStorage.getItem("itemsPerPage")) || 10);

  // Fetch API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/comments");
        if (!res.ok) throw new Error("Failed to fetch comments");
        const json = await res.json();
        const formatted: CommentData[] = json.map((item: any) => ({
          postId: item.postId,
          name: item.name,
          email: item.email,
          comment: item.body,
        }));
        setData(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  // Persist state in localStorage
  useEffect(() => {
    localStorage.setItem("search", search);
    localStorage.setItem("sortKey", sortKey);
    localStorage.setItem("sortAsc", String(sortAsc));
    localStorage.setItem("currentPage", String(currentPage));
    localStorage.setItem("itemsPerPage", String(itemsPerPage));
  }, [search, sortKey, sortAsc, currentPage, itemsPerPage]);


  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.comment.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // Sort cycle: no sort -> ascending -> descending -> no sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (typeof valA === "number" && typeof valB === "number") {
        return sortAsc ? valA - valB : valB - valA;
      } else {
        return sortAsc
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      }
    });
    return sorted;
  }, [filteredData, sortKey, sortAsc]);

  if (loading){
    return <div className="flex justify-center  h-screen">Loading...</div>;
  } 
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  // Filter with partial search
  

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Sorting handler with cycle logic
  const handleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortAsc(true); // ascending first
    } else {
      if (sortAsc) {
        setSortAsc(false); // switch to descending
      } else {
        setSortKey(""); // remove sort
      }
    }
    setCurrentPage(1); // reset page on sort
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <Button
        className="px-3 py-1.5 border border-gray-300 rounded-md bg-white shadow-md text-gray-700 hover:bg-gray-50" 
        onClick={() => handleSort("postId")}>
          Sort Post ID
        </Button>

        <Button
        className="px-3 py-1.5 border border-gray-300 rounded-md bg-white shadow-md text-gray-700 hover:bg-gray-50"
         onClick={() => handleSort("name")}>
          Sort Name
        </Button>

        <Button className="px-3 py-1.5 border border-gray-300 rounded-md bg-white shadow-md text-gray-700 hover:bg-gray-50"
        onClick={() => handleSort("email")}>
          Sort Email
         </Button>

        <input
          type="text"
          placeholder="Search name, email, comment"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
          className="ml-auto p-2 border border-gray-500 rounded-md w-full max-w-sm shadow-md focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 bg-white">
        <Table>
          <TableCaption className="text-gray-700 p-3 text-sm">
            A list of your comments.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-slate-300">
              <TableHead
               onClick={() => handleSort("postId")} 
               className="text-blue-900 font-semibold cursor-pointer">
                Post ID {sortKey === "postId" && (sortAsc ? "↑" : "↓")}
              </TableHead>

              <TableHead 
              onClick={() => handleSort("name")}
              className="text-blue-900 font-semibold cursor-pointer">
                Name {sortKey === "name" && (sortAsc ? "↑" : "↓")}
              </TableHead>

              <TableHead 
              onClick={() => handleSort("email")} 
              className="text-blue-900 font-semibold cursor-pointer">
                Email {sortKey === "email" && (sortAsc ? "↑" : "↓")}
              </TableHead>

              <TableHead className="text-blue-900 font-semibold cursor-pointer">
                Comment
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <TableRow key={idx} className="hover:bg-gray-50">
                  <TableCell className="text-blue-900">{item.postId}</TableCell>
                  <TableCell className="text-blue-900">{item.name}</TableCell>
                  <TableCell className="text-blue-900">{item.email}</TableCell>
                  <TableCell className=" text-blue-900 truncate max-w-xs">{item.comment}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3 text-sm text-gray-700 relative">
          {/* Item range */}
          <span className="text-center md:text-left">
            <span className="font-semibold">
              {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, sortedData.length)}
            </span>{" "}
            of <span className="font-semibold">{sortedData.length}</span> items
          </span>

          {/* Pagination buttons */}
          <div className="flex items-center justify-center gap-2 order-first md:order-none">
            {/* ⬅️ On small screens, keep inline not absolute */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 border border-gray-300 rounded-md bg-white shadow-sm disabled:opacity-50 hover:bg-gray-50 text-xs md:text-sm"
            >
              Prev
            </button>
            <span className="text-xs md:text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 border border-gray-300 rounded-md bg-white shadow-sm disabled:opacity-50 hover:bg-gray-50 text-xs md:text-sm"
            >
              Next
            </button>
          </div>

          {/* Items per page selector */}
          <select
            className="border border-gray-300 p-1.5 rounded-md shadow-sm bg-white text-gray-700 self-center md:self-auto text-xs md:text-sm"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // reset page when page size changes
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / Page
              </option>
            ))}
          </select>
        </div>

      
    </div>
  );
};

export default TableComponent;
