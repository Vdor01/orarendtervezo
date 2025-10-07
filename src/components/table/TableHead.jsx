import { useState } from 'react'

const TableHead = ({ columns, handleSorting }) => {
    const [sortField, setSortField] = useState("");
    const [order, setOrder] = useState("asc");

    const handleSortingChange = (accessor) => {
        const sortOrder = accessor === sortField && order === "asc" ? "desc" : "asc";
        setSortField(accessor);
        setOrder(sortOrder);
        handleSorting(accessor, sortOrder);
    }

    return (
        <thead>
            <tr>
                {columns.map(({ label, accessor, sortable }) => {
                    const cl = sortable
                        ? accessor === sortField && order === "asc"
                            ? "-up"
                            : accessor === sortField && order === "desc"
                                ? "-down"
                                : ""
                        : "";
                    return (
                        <th key={accessor} onClick={sortable ? () => handleSortingChange(accessor) : null} className={sortable ? `cursor-pointer select-none` : ""}>
                            {label}
                            {sortable && <i className={`pi pi-sort${cl}`} />}
                        </th>
                    );
                })}
            </tr>
        </thead>
    )
}

export default TableHead