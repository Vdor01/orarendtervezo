import React, { useState, useEffect } from 'react'
import TableHead from '../table/TableHead'
import TableBody from '../table/TableBody';

const CourseTable = ({ subject }) => {


    const columns = [
        { label: "Kód", accessor: "course", sortable: true, sortbyOrder: "asc" },
        { label: "Típus", accessor: "type", sortable: true },
        { label: "Oktató", accessor: "instructor", sortable: true },
        { label: "Helyszín", accessor: "location", sortable: true },
        { label: "Nap", accessor: "day", sortable: true },
        { label: "Időpont", accessor: "time", sortable: false },
        { label: "Megjegyzés", accessor: "notes", sortable: false },
        { label: "", accessor: "actions", sortable: false },
    ];

    function getDefaultSorting(defaultData, columns) {
        const sorted = [...defaultData].sort((a, b) => {
            const filterColumn = columns.filter(column => column.sortbyOrder);

            let { accessor = "id", sortbyOrder = "asc" } = Object.assign({}, ...filterColumn);

            if (a[accessor] == null) return 1;
            if (b[accessor] == null) return -1;
            if (a[accessor] == null && b[accessor] == null) return 0;

            const ascending = a[accessor].toString().localeCompare(b[accessor].toString(), 'en', { numeric: true });

            return sortbyOrder === "asc" ? ascending : -ascending;
        });

        return sorted;
    }

    const useSortableTable = (data, columns) => {
        const [tableData, setTableData] = useState(getDefaultSorting(data, columns));

        useEffect(() => {
            setTableData(getDefaultSorting(data, columns));
        }, [data]);

        const handleSorting = (sortField, sortOrder) => {
            if (sortField) {
                const sorted = [...tableData].sort((a, b) => {
                    if (a[sortField] == null) return 1;
                    if (b[sortField] == null) return -1;
                    if (a[sortField] == null && b[sortField] == null) return 0;

                    if (sortField === "day") {
                        const days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
                        const aDay = days.indexOf(a[sortField]);
                        const bDay = days.indexOf(b[sortField]);
                        return (aDay - bDay) * (sortOrder === "asc" ? 1 : -1);
                    }

                    return (
                        a[sortField].toString().localeCompare(b[sortField].toString(), 'en', { numeric: true }) * (sortOrder === "asc" ? 1 : -1)
                    );
                });

                setTableData(sorted);
            }
        }

        return [tableData, handleSorting];
    }

    const [tableData, handleSorting] = useSortableTable(subject.courses, columns);

    return (
        <table className='table overflow-x-scroll table-auto xl:table-md table-sm table-pin-cols'>
            <TableHead columns={columns} handleSorting={handleSorting} />
            <TableBody columns={columns} data={tableData} subject={subject} />
        </table>
    )
}

export default CourseTable