import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import DataTable from "react-data-table-component";

const apiUrl = process.env.REACT_APP_API_URL;
function NotificationPage() {
  const [notification, setNotification] = useState([]);
  const [filter, setFilter] = useState({
    start_date: new Date(),
    end_date: new Date(),
  });
  async function getNotification() {
    const id = localStorage.getItem("user_id");
    const role = localStorage.getItem("role");
    const response = await axios.get(
      `${apiUrl}/get_all_notification?user_id=${id}&role=${role}`
    );
    console.log("notification", response.data);
    setNotification(response.data);
  }

  // Name</th>
  //                   <th>Number</th>
  //                   <th>Entry Time</th>
  //                   <th>Exit Time</th>
  //                   <th>Status</th>
  //                   <th>Action</th>

  const notificationColumns = [
    {
      name: "Name",

      selector: (row) => row?.title,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => (
        <p
          title={row?.description}
          style={{
            width: "300px" /* Adjust as needed */,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row?.description}
        </p>
      ),
    },

    {
      name: "Date",
      selector: (row) => moment(row?.date).format("MMMM Do YYYY, h:mm A"),
      sortable: true,
    },
  ];
  const exportToExcel = () => {
    const columnsForExport = notificationColumns.map((column) => ({
      title: column.name,
      dataIndex: column.selector,
    }));

    const dataForExport = notification.map((row) =>
      notificationColumns.map((column) => {
        if (column.selector && typeof column.selector === "function") {
          return column.selector(row);
        }
        return row[column.selector];
      })
    );

    const exportData = [
      columnsForExport.map((col) => col.title),
      ...dataForExport,
    ];

    const blob = new Blob(
      [exportData.map((row) => row.join("\t")).join("\n")],
      {
        type: "application/vnd.ms-excel",
      }
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "attendence-table.xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    getNotification();
  }, []);
  return (
    <>
      <div className="content-wrapper">
        <section className="content">
          <div className="container pl-0">
            <div className="panel-body  pr-0">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button className="btn btn-primary" onClick={getNotification}>
                  Refresh
                </button>

                <button
                  className="btn btn-primary"
                  onClick={exportToExcel}
                  style={{ backgroundColor: "black" }}
                >
                  Export To Excel
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label>Start date</label>
                <input
                  type="date"
                  className="form-control"
                  style={{ width: 300, margin: 10 }}
                  onChange={(e) => {
                    setFilter((p) => ({ ...p, start_date: e.target.value }));
                  }}
                />
                <label>End date</label>
                <input
                  type="date"
                  className="form-control"
                  style={{ width: 300, margin: 10 }}
                  onChange={(e) => {
                    setFilter((p) => ({ ...p, end_date: e.target.value }));
                  }}
                />
                <button
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    margin: 10,
                  }}
                  className="btn"
                  onClick={getNotification}
                >
                  Filter
                </button>
              </div>
              <DataTable
                responsive
                id="table-to-export"
                columns={notificationColumns}
                data={notification}
                pagination
                fixedHeader
                fixedHeaderScrollHeight="550px"
                selectableRows
                selectableRowsHighlight
                highlightOnHover
                subHeader
                // customStyles={customStyles}
                // selectedRows={selectedRowIds}
                // onSelectedRowsChange={handleSelectedRowsChange}
                striped
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default NotificationPage;
