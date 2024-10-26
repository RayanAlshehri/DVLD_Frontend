import { useState } from "react";
import { useTable } from "react-table";

function Table({columns, tableData, onSelectedRowChange}) {
    const [selectedRowId, setSelectedRowId] = useState(0);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: tableData });

    const handleRowClick = (rowId) => {
        setSelectedRowId(rowId);
        onSelectedRowChange?.(rowId);
    }

    return (
        <table {...getTableProps()} className="table">
            <thead>
                {headerGroups.map(headerGroup => {
                    const { key: headerGroupKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps();

                    return (
                        <tr {...headerGroupProps} key={headerGroupKey} className="table-header">
                            {headerGroup.headers.map(column => {
                                const { key: columnKey, ...columnProps } = column.getHeaderProps();

                                return (
                                    <th {...columnProps} key={columnKey} className="table-cell">
                                        {column.render("Header")}
                                    </th>
                                )
                            })}
                        </tr>
                    )
                })}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    const { key: rowKey, ...rowProps } = row.getRowProps();
                    return (
                        <tr
                            key={rowKey}
                            {...rowProps}
                            className={row.id == selectedRowId ? "selected" : ""}
                            onClick={() => handleRowClick(row.id)}
                        >
                            {row.cells.map(cell => {
                                const { key: cellKey, ...cellProps } = cell.getCellProps();
                                return (
                                    <td key={cellKey} {...cellProps} className='table-cell'>
                                        {cell.render('Cell')}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
}

export default Table;