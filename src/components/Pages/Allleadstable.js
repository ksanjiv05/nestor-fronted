import React, { useState, useEffect } from "react";

import axios from "axios";
import DataTable from "react-data-table-component";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux";
import { getAllAgent, getAllAgentWithData } from "../../features/agentSlice";
import { getAllStatus } from "../../features/statusSlice";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import ReactHTMLTableToExcel from 'react-html-table-to-excel'; // Import the library
import { addfollowup, getAllFollowup } from "../../features/followupSlice";
import moment from "moment";
export const Allleadstable = ({
  sendDataToParent,
  isHotLead = false,
  dataFromParent,
  agents,
}) => {
  const dispatch = useDispatch();
  const [leads, setleads] = useState([]);
  const [status, setstatus] = useState("true");
  const [search, setsearch] = useState("");
  const [filterleads, setfilterleads] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectedRowIds1, setSelectedRowIds1] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { agent } = useSelector((state) => state.agent);
  const { Statusdata } = useSelector((state) => state.StatusData);
  const apiUrl = process.env.REACT_APP_API_URL;
  const DBuUrl = process.env.REACT_APP_DB_URL;
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCallingLead, setCurrentCallingLead] = useState(undefined);
  const [isCallingStart, setIsCallingStart] = useState(false);
  const [dataa, setData] = useState({
    followup_date: new Date(), // Initialize with the current date
  });
  // console.log('agentssssssssssss',agents)
  const handlePageChange = (page) => {
    setCurrentPage(page); // Update current page state when page changes
  };

  const handleQuickEdit = (row) => {
    // if (!currentCallingLead) {
    //   toast.warn("please call first");
    //   return;
    // }
    // if (currentCallingLead._id != row._id) {
    //   toast.warn("edit is allowed in which you have called");
    //   return;
    // }
    setSelectedRow(row); // Set the row data
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const getdatetimeformate = (datetime) => {
    if (datetime) {
      const dateObject = new Date(datetime);
      const formattedDate = `${padZero(dateObject.getDate())}-${padZero(
        dateObject.getMonth() + 1
      )}-${dateObject.getFullYear()} ${padZero(
        dateObject.getHours()
      )}:${padZero(dateObject.getMinutes())}`;
      return formattedDate;
    } else {
      return " ";
    }
  };
  function padZero(num) {
    return num < 10 ? `0${num}` : num;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentCallingLead) {
      toast.warn("please call first");
      return;
    }

    const followupDate = selectedRow?.followup_date;

    if (!followupDate) {
      toast.warn("Followup date is required");
      return;
    }

    // Custom format function to preserve exact date and time
    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const updatedLeadData = {
      lead_id: selectedRow._id,
      commented_by: selectedRow?.agent_details[0]?._id || "",
      followup_status_id: selectedRow.status_details[0]?._id || "",
      followup_date: formatDate(followupDate), // Use the custom format function
      followup_won_amount: selectedRow.followup_won_amount || 0,
      followup_lost_reason_id: selectedRow.followup_lost_reason_id || "",
      add_to_calender: selectedRow.add_to_calender || false,
      followup_desc: selectedRow.description || "",
    };

    console.log("Submitting data:", updatedLeadData);

    try {
      const fatch = await axios.put(`${apiUrl}/update_call_log`, {
        user_id: localStorage.getItem("user_id"),
        lead_id: selectedRow._id,
      });
      const response = await dispatch(addfollowup(updatedLeadData));
      if (response.payload.success) {
        toast.success(response.payload?.message);
        //window.location.reload();
        if (localStorage.getItem("role") === "admin") {
          getAllLead1();
        } else {
          getAllLead2(localStorage.getItem("user_id"));
        }
        handleCloseModal();
        setCurrentCallingLead(undefined);
      } else {
        toast.warn(response.payload?.message);
        //window.location.reload();
        if (localStorage.getItem("role") === "admin") {
          getAllLead1();
        } else {
          getAllLead2(localStorage.getItem("user_id"));
        }
        handleCloseModal();
        setCurrentCallingLead(undefined);
      }
    } catch (error) {
      console.error("Error submitting followup:", error);
      toast.error("An error occurred while submitting followup");
    }
  };

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const quickEditModal = (
    <div
      className={`modal fade ${isModalOpen ? "show" : ""}`}
      style={{ display: isModalOpen ? "block" : "none" }}
      aria-labelledby="quickEditModalLabel"
      aria-hidden={!isModalOpen}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="quickEditModalLabel">
              Quick Edit
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseModal}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="lastComment" className="form-label">
                  Last Comment
                </label>
                <textarea
                  id="lastComment"
                  className="form-control"
                  value={selectedRow?.description || ""}
                  onChange={(e) =>
                    setSelectedRow({
                      ...selectedRow,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label htmlFor="followupDateTime" className="form-label">
                  Follow-up Date and Time
                </label>
                {/* <input
                  type="datetime-local"
                  id="followupDateTime"
                  className="form-control"
                  value={selectedRow?.followup_date ? formatDateToLocal(selectedRow.followup_date) : ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, followup_date: e.target.value })}
                /> */}
                <DatePicker
                  // selected={dataa.followup_date}
                  // onChange={(date) => setData({ ...selectedRow, followup_date: date })}
                  selected={
                    selectedRow?.followup_date
                      ? new Date(selectedRow.followup_date)
                      : null
                  }
                  onChange={(date) =>
                    setSelectedRow({ ...selectedRow, followup_date: date })
                  }
                  showTimeSelect
                  timeFormat="hh:mm aa"
                  timeIntervals={5}
                  timeCaption="Time"
                  dateFormat="dd/MM/yyyy h:mm aa" // Custom format: day/month/year and 12-hour time
                  className="form-control"
                  placeholderText="Followup date"
                  name="followup_date"
                  id="followup_date"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Change Status
                </label>
                <select
                  id="status"
                  className="form-control"
                  value={selectedRow?.status_details[0]?._id || ""}
                  onChange={(e) =>
                    setSelectedRow({
                      ...selectedRow,
                      status_details: [{ _id: e.target.value }],
                    })
                  }
                >
                  <option value="">Select Status</option>
                  {Statusdata.leadstatus?.map((status) => (
                    <option key={status._id} value={status._id}>
                      {status.status_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // dispatch(getAllAgent());
        dispatch(getAllStatus());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const getAllLead = async () => {
    try {
      const responce = await axios.get(
        `${apiUrl}/get_all_lead?isHotLead=${isHotLead}`,
        {
          headers: {
            "Content-Type": "application/json",
            "mongodb-url": DBuUrl,
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setstatus(responce?.data?.success);
      setleads(responce?.data?.lead);
      setfilterleads(responce?.data?.lead);
      return responce?.data?.message;
    } catch (error) {
      console.log(error);
      setfilterleads();
    }
  };
  const getAllLead1 = async () => {
    try {
      const responce = await axios.get(`${apiUrl}/get_all_lead`, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
        },
      });
      // const leads = responce?.data?.lead || [];
      // if (isCallingStart && leads.length > 0) {
      //   handleCalling(leads[0]);
      // }
      setstatus(responce?.data?.success);
      setleads(responce?.data?.lead);
      setfilterleads(responce?.data?.lead);
      return responce?.data?.message;
    } catch (error) {
      console.log(error);
      setfilterleads();
    }
  };

  const getAllLead2 = async (assign_to_agent) => {
    try {
      const responce = await axios.post(
        `${apiUrl}/get_Leadby_agentid_with_status`,
        {
          assign_to_agent,
        }
      );

      setstatus(responce?.data?.success);
      if (responce?.data?.success === true) {
        // const leadArray = responce?.data?.lead || [];
        // if (isCallingStart && leadArray.length > 0) {
        //   handleCalling(responce?.data?.lead[0]);
        // }
        setstatus(responce?.data?.success);
        setleads(responce?.data?.lead);
        setfilterleads(responce?.data?.lead);
      }
      if (responce?.data?.success === false) {
        // const leadArray = responce?.data?.lead || [];
        // if (isCallingStart && leadArray.length > 0) {
        //   handleCalling(responce?.data?.lead[0]);
        // }
        setstatus(responce?.data?.success);
        setleads(responce?.data?.lead);
        setfilterleads(responce?.data?.lead);
      }
    } catch (error) {
      const message = await error?.response?.data?.message;
      if (message == "Client must be connected before running operations") {
        getAllLead2();
      }
      console.log(error);
      setfilterleads();
    }
  };
  /////// For Team Leader
  const getAllLead3 = async (assign_to_agent) => {
    try {
      const responce = await axios.post(
        `${apiUrl}/getLeadbyTeamLeaderidandwithstatus`,
        {
          assign_to_agent,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "mongodb-url": DBuUrl,
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setstatus(responce?.data?.success);
      if (responce?.data?.success === true) {
        setleads(responce?.data?.lead);
        setfilterleads(responce?.data?.lead);
        return responce?.data?.message;
      }
    } catch (error) {
      const message = await error?.response?.data?.message;
      if (message == "Client must be connected before running operations") {
        getAllLead3();
      }
      console.log(error);
      setfilterleads();
    }
  };
  const getAllLead4 = async (assign_to_agent) => {
    try {
      const responce = await axios.post(
        `${apiUrl}/getLeadbyGroupLeaderidandwithstatus`,
        {
          assign_to_agent,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "mongodb-url": DBuUrl,
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setstatus(responce?.data?.success);
      if (responce?.data?.success === true) {
        setleads(responce?.data?.lead);
        setfilterleads(responce?.data?.lead);
        return responce?.data?.message;
      }
    } catch (error) {
      const message = await error?.response?.data?.message;
      if (message == "Client must be connected before running operations") {
        getAllLead3();
      }
      console.log(error);
      setfilterleads();
    }
  };

  useEffect(() => {
    if (localStorage.getItem("role") === "admin") {
      getAllLead1();
      dispatch(getAllAgent());
    } else if (localStorage.getItem("role") === "TeamLeader") {
      getAllLead3(localStorage.getItem("user_id"));
      dispatch(
        getAllAgentWithData({
          assign_to_agent: localStorage.getItem("user_id"),
        })
      );
    } else if (localStorage.getItem("role") === "GroupLeader") {
      getAllLead4(localStorage.getItem("user_id"));
      dispatch(
        getAllAgentWithData({
          assign_to_agent: localStorage.getItem("user_id"),
        })
      );
    } else {
      getAllLead2(localStorage.getItem("user_id"));
      dispatch(
        getAllAgent({ assign_to_agent: localStorage.getItem("user_id") })
      );
    }
  }, [
    localStorage.getItem("user_id"),
    apiUrl,
    DBuUrl,
    localStorage.getItem("role"),
  ]);

  useEffect(() => {
    const result = leads.filter((lead) => {
      return (
        (lead.full_name &&
          lead.full_name.toLowerCase().includes(search.toLowerCase())) ||
        (lead.agent_details &&
          lead.agent_details[0]?.agent_name &&
          lead.agent_details[0].agent_name
            .toLowerCase()
            .includes(search.toLowerCase())) ||
        (lead.service_details &&
          lead.service_details[0]?.product_service_name &&
          lead.service_details[0].product_service_name
            .toLowerCase()
            .includes(search.toLowerCase())) ||
        (lead.lead_source_details &&
          lead.lead_source_details[0]?.lead_source_name &&
          lead.lead_source_details[0].lead_source_name
            .toLowerCase()
            .includes(search.toLowerCase())) ||
        (lead.status_details &&
          lead.status_details[0]?.status_name &&
          lead.status_details[0].status_name
            .toLowerCase()
            .includes(search.toLowerCase())) ||
        (lead.contact_no &&
          lead.contact_no.toLowerCase().includes(search.toLowerCase()))
      );
    });
    setfilterleads(result);
  }, [search]);

  const isAdmin =
    localStorage.getItem("role") === "admin" ||
    localStorage.getItem("role") === "TeamLeader";
  const isAdmin1 = localStorage.getItem("role") === "admin";

  ////// cleck per page
  const handleCheckAll = (e) => {
    e.preventDefault();
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filterleads.length);
    const currentPageIds = filterleads
      .slice(startIndex, endIndex)
      .map((row) => row._id);
    const allSelectedOnPage = currentPageIds.every((id) =>
      selectedRowIds1.includes(id)
    );

    if (allSelectedOnPage) {
      setSelectedRowIds1((prevIds) =>
        prevIds.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedRowIds1((prevIds) => [
        ...new Set([...prevIds, ...currentPageIds]),
      ]);
    }
    sendDataToParent(selectedRowIds1);
    // console.log('cleck per page select',selectedRowIds1)
  };

  ////// cleck All page
  const handleCheckAll1 = (e) => {
    e.preventDefault();
    const currentPageIds = filterleads.map((row) => row._id);
    const allSelectedOnPage = currentPageIds.every((id) =>
      selectedRowIds1.includes(id)
    );

    if (allSelectedOnPage) {
      setSelectedRowIds1((prevIds) =>
        prevIds.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedRowIds1((prevIds) => [
        ...prevIds,
        ...currentPageIds.filter((id) => !prevIds.includes(id)),
      ]);
    }
    sendDataToParent(selectedRowIds1);
    // console.log('cleck All page select',selectedRowIds1)
  };

  const handleSingleCheck = async (e, row) => {
    const selectedId = e.target.value;
    const isChecked = e.target.checked;
    if (isChecked) {
      await setSelectedRowIds1((prevIds) => [...prevIds, selectedId]);
    } else {
      await setSelectedRowIds1((prevIds) =>
        prevIds.filter((id) => id !== selectedId)
      );
    }
  };

  useEffect(() => {
    sendDataToParent(selectedRowIds1);
  }, [selectedRowIds1]);

  const commonColumns = [
    {
      name: "Checkbox",
      cell: (row, index) => (
        <>
          {" "}
          <input
            type="checkbox"
            defaultValue={row._id}
            checked={selectedRowIds1.includes(row._id)} // ensure checkboxes reflect selection state
            onChange={(e) => handleSingleCheck(e, row)}
          />
        </>
      ),
    },

    {
      name: "Name",
      cell: (row) => (
        <a href={`/followupleads/${row?._id}`}>{row?.full_name}</a>
      ),
      selector: (row) => row?.full_name,
      sortable: true,
    },
    {
      name: "Number",
      selector: (row) => row?.contact_no,
      sortable: true,
    },
    {
      name: "Lead Source",
      selector: (row) => row?.lead_source_details[0]?.lead_source_name,
      sortable: true,
    },
    {
      name: "Calling",
      cell: (row) => (
        <i
          onClick={() => handleCalling(row)}
          class="fas fa-phone "
          style={{ fontSize: 25, color: "yellowgreen" }}
        ></i>
      ),
    },
    {
      name: "Date",
      selector: (row) => row?.created, // row?.followup_date,
      cell: (row) => moment(row?.created).format("DD/MM/YYYY"),
      sortable: true,
    },
  ];

  const handleCalling = async (data) => {
    try {
      const phoneNumber = data.contact_no;
      const response = await axios.post(`${apiUrl}/add_new_call_log`, {
        user_id: localStorage.getItem("user_id"),
        lead_id: data._id,
      });
      setIsCallingStart(true);
      setCurrentCallingLead(data);
      console.log("callling", data);
      if (
        /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        window.open(`tel:${phoneNumber}`); // Trigger the call manually
      } else {
        window.location.href = `tel:${phoneNumber}`; // Trigger the call manually
      }
    } catch (error) {
      console.log("error in handleCalling", error);
    }
  };

  const getStatusBadgeClass = (statusName) => {
    switch (statusName) {
      case "Call Back & Hot Lead": {
        return "bg-danger";
      }
      case "Meeting": {
        return "bg-success";
      }
      case "Call Back": {
        return "bg-warning text-dark";
      }

      default:
        return "bg-default"; // Default class for other statuses
    }
  };
  // const [response, setResponse] = useState(null);
  // const [error, setError] = useState(null);

  // const StartCall = async (mobile, coustmername, agentname, agentid) => {
  //   let agentNumber;

  //   if (agentid === "660e41a556c9cfebc340c62a") {
  //     agentNumber = "9315857918"; // Khayati
  //   } else if (agentid === "660e411856c9cfebc340c5e5") {
  //     agentNumber = "7669599759"; // Nabya
  //   } else {
  //     agentNumber = "7669599759"; // Nabya (default)
  //   }

  //   let data = JSON.stringify({
  //     secretKey: "Ha59PMqNZ2JRdChP",
  //     clientId: "Magiec_C2C",
  //     agentNumber: `${agentNumber}`,
  //     customerNumber: `${mobile}`,
  //     agentName: `${agentname}`,
  //     customerName: `${coustmername}`,
  //     calledId: "08037658901",
  //   });

  //   let config = {
  //     method: "post",
  //     maxBodyLength: Infinity,
  //     url: "https://c2c.ivrobd.com/api/c2c/process",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     data: data,
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       setResponse(response.data);
  //     })
  //     .catch((error) => {
  //       setError(error);
  //     });
  // };

  const adminColumns = [
    // {
    //   name: "Agent",
    //   selector: (row) => row?.agent_details[0]?.agent_name,
    //   sortable: true,
    // },
    {
      name: "Status",
      selector: (row) => row?.status_details[0]?.status_name,

      sortable: true,
    },
    {
      name: "Service",
      selector: (row) => row?.service_details[0]?.product_service_name,
      sortable: true,
    },
    {
      name: <div style={{ display: "none" }}>`</div>,
      selector: (row) => row?.description,
      sortable: true,
      cell: (row) => <div style={{ display: "none" }}>{row.description}</div>,
    },

    {
      name: "Quick Edit",
      cell: (row) => (
        <button onClick={() => handleQuickEdit(row)}>Quick Edit</button>
      ),
    },

    {
      // name: "Followup date",
      name: <div style={{ display: "none" }}>Followup date</div>,
      selector: (row) =>
        row?.followup_date ? (
          <div style={{ display: "none" }}>
            {getdatetimeformate(row?.followup_date)}
          </div>
        ) : (
          //  row?.followup_date && format(new Date(datafomate(row?.followup_date)), 'dd/MM/yy hh:mm:ss')

          ""
        ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <a href={`/followupleads/${row?._id}`}>
            <button className="btn btn-success btn-sm">
              <i className="fa fa-pencil-square" aria-hidden="true"></i>
            </button>
            <span
              className={`badge ${getStatusBadgeClass(
                row?.status_details[0]?.status_name
              )}`}
              style={{ marginLeft: "10px" }}
            >
              {row?.status_details[0]?.status_name == "Call Back & Hot Lead"
                ? "Hot"
                : row?.status_details[0]?.status_name == "Call Back"
                ? "C"
                : row?.status_details[0]?.status_name == "Meeting"
                ? "M"
                : ""}
            </span>
          </a>
          {/* <span
            onClick={() =>
              StartCall(
                row?.contact_no,
                row?.full_name,
                row?.agent_details[0]?.agent_name,
                row?.agent_details[0]?._id
              )
            }
            className="btn btn-danger btn-sm"
          >
            <i className="fa fa-phone"></i>
          </span> */}
        </>
      ),

      sortable: true,
    },
  ];
  const role = localStorage.getItem("role");
  // const aaaa =agents.map((ag)=>)
  console.log("aaaa", agents);

  const userColumns = [
    {
      name: "Status",
      selector: (row) => row?.status_details[0]?.status_name,
      sortable: true,
    },
    {
      name: "Service",
      selector: (row) => row?.service_details[0]?.product_service_name,
      sortable: true,
    },
    {
      name: <div style={{ display: "" }}>Last Comment</div>,
      selector: (row) => row?.description,
      sortable: true,
      cell: (row) => <div style={{ display: "" }}>{row.description}</div>,
    },

    {
      name: "Quick Edit",
      cell: (row) => (
        <button onClick={() => handleQuickEdit(row)}>Quick Edit</button>
      ),
    },

    {
      // name: "Followup date",
      name: <div style={{ display: "none" }}>Followup date</div>,
      selector: (row) =>
        row?.followup_date ? (
          <div style={{ display: "none" }}>
            {getdatetimeformate(row?.followup_date)}
          </div>
        ) : (
          //  row?.followup_date && format(new Date(datafomate(row?.followup_date)), 'dd/MM/yy hh:mm:ss')

          ""
        ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <a href={`/followupleads/${row?._id}`}>
            <button className="btn btn-success">
              <i className="fa fa-pencil-square" aria-hidden="true"></i>
            </button>
            <span
              className={`badge ${getStatusBadgeClass(
                row?.status_details[0]?.status_name
              )}`}
              style={{ marginLeft: "10px" }}
            >
              {row?.status_details[0]?.status_name == "Call Back & Hot Lead"
                ? "Hot"
                : row?.status_details[0]?.status_name == "Call Back"
                ? "C"
                : row?.status_details[0]?.status_name == "Meeting"
                ? "M"
                : ""}
            </span>
          </a>
          {/* <span
            onClick={() =>
              StartCall(
                row?.contact_no,
                row?.full_name,
                row?.agent_details[0]?.agent_name,
                row?.agent_details[0]?._id
              )
            }
            className="btn btn-danger btn-sm"
          >
            <i className="fa fa-phone"></i>
          </span> */}
        </>
      ),
      sortable: true,
    },
  ];
  if (role === "GroupLeader") {
    userColumns.splice(3, 0, {
      name: <div style={{ display: "" }}>TeamLeader</div>,
      selector: (row) => {
        const matchingAgent = agents.find(
          (agent) => agent._id === row?.agent_details[0]?._id
        );

        if (matchingAgent) {
          if (matchingAgent.role === "TeamLeader") {
            return matchingAgent.agent_name;
          }
          if (matchingAgent.role === "GroupLeader") {
            return `${matchingAgent.agent_name} (GM)`;
          } else if (matchingAgent.role === "user") {
            return matchingAgent.agent_details.length > 0
              ? matchingAgent.agent_details[0].agent_name
              : "";
          }
        }

        return "";
      },
      sortable: true,
    });

    userColumns.splice(4, 0, {
      name: "Agent",
      // selector: (row) => row?.agent_details[0]?.agent_name,
      selector: (row) => {
        const matchingAgent = agents.find(
          (agent) => agent._id === row?.agent_details[0]?._id
        );

        return matchingAgent && matchingAgent.role === "user"
          ? matchingAgent.agent_name
          : "";
      },
      sortable: true,
    });
  }

  if (role === "admin") {
    adminColumns.splice(2, 0, {
      name: <div style={{ display: "" }}>GroupLeader</div>,
      selector: (row) => {
        const matchingAgent = agents.find(
          (agent) => agent._id === row?.agent_details[0]?._id
        );

        if (matchingAgent) {
          if (matchingAgent.role === "GroupLeader") {
            return `${matchingAgent.agent_name}`;
          }
          if (matchingAgent.role === "TeamLeader") {
            return matchingAgent.agent_details.length > 0
              ? matchingAgent.agent_details[0].agent_name
              : "";
          }
          if (matchingAgent.role === "user") {
            const userAgentDetails = matchingAgent.agent_details;

            if (userAgentDetails.length > 0) {
              const teamLeader = agents.find(
                (agent) =>
                  agent._id === userAgentDetails[0]._id &&
                  agent.role === "TeamLeader"
              );
              if (teamLeader.role === "TeamLeader") {
                return teamLeader.agent_details.length > 0
                  ? teamLeader.agent_details[0].agent_name
                  : "";
              }
            }
          }
        }

        return "";
      },
      sortable: true,
    });

    adminColumns.splice(3, 0, {
      name: <div style={{ display: "" }}>TeamLeader</div>,
      selector: (row) => {
        const matchingAgent = agents.find(
          (agent) => agent._id === row?.agent_details[0]?._id
        );

        if (matchingAgent) {
          if (matchingAgent.role === "TeamLeader") {
            return matchingAgent.agent_name;
          }
          // if (matchingAgent.role === "GroupLeader") {
          //   return `${matchingAgent.agent_name} (GM)`;
          // }
          else if (matchingAgent.role === "user") {
            return matchingAgent.agent_details.length > 0
              ? matchingAgent.agent_details[0].agent_name
              : "";
          }
        }

        return "";
      },
      sortable: true,
    });

    adminColumns.splice(4, 0, {
      name: "Agent",
      // selector: (row) => row?.agent_details[0]?.agent_name,
      selector: (row) => {
        const matchingAgent = agents.find(
          (agent) => agent._id === row?.agent_details[0]?._id
        );

        return matchingAgent && matchingAgent.role === "user"
          ? matchingAgent.agent_name
          : "";
      },
      sortable: true,
    });
  }

  if (role === "TeamLeader") {
    adminColumns.splice(3, 0, {
      name: "Agent",
      selector: (row) => row?.agent_details[0]?.agent_name,
      sortable: true,
    });
  }

  const columns = isAdmin
    ? [...commonColumns, ...adminColumns]
    : [...commonColumns, ...userColumns];

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableDataForPDF = filterleads.map((row) =>
      columns.map((column) => {
        if (column.selector && typeof column.selector === "function") {
          return column.selector(row);
        }
        return row[column.selector];
      })
    );
    doc.autoTable({
      head: [columns.map((column) => column.name)],
      body: tableDataForPDF,
    });
    doc.save("table.pdf");
  };

  const customStyles = {
    cells: {
      style: {
        border: "0px solid #ddd", // Set the cell border
        fontSize: "14px",
        // background: "#f4f3fe",
      },
    },
    headCells: {
      style: {
        border: "0px solid #111", // Set the header cell border
        fontSize: "14px",
        background: "#f0f0f0",
      },
    },
    rows: {
      style: {
        background: "#fdf1f1", // Set the default background color
      },
    },
    highlightOnHover: {
      style: {
        background: "#f4f3fe", // Set the background color on hover
      },
    },
    striped: {
      style: {
        background: "#f8f9fa", // Set the background color for striped rows
      },
    },
    // Hide the Last Comment column
    // rows: {
    //   style: {
    //     display: "none",
    //   },
    // },
  };

  const handleSelectedRowsChange = ({ selectedRows }) => {
    let selectedIds = selectedRows.map((row) => row._id);
    setSelectedRowIds(selectedIds);
    sendDataToParent(selectedIds);
  };

  const [adSerch, setAdvanceSerch] = useState([]);

  const DeleteSelected = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");

    if (confirmDelete) {
      const aaaaa = { ids: selectedRowIds1 };

      fetch(`${apiUrl}/BulkDeleteLead`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(aaaaa),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data?.success == true) {
            toast.success(data?.message);
            setTimeout(() => {
              window.location.reload(false);
            }, 500);
          } else {
            toast.warn(data?.message);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
      console.log("Item deleted!");
    } else {
      toast.success("Delete canceled");
      console.log("Delete canceled");
    }
  };

  const AdvanceSerch = async (e) => {
    e.preventDefault();
    const updatedata = {
      ...adSerch,
      user_id: localStorage.getItem("user_id"),
      role: localStorage.getItem("role"),
    };
    fetch(`${apiUrl}/getAdvanceFillter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "mongodb-url": DBuUrl,
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(updatedata),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response from server:", data);
        setstatus(data?.success);
        setleads(data?.lead);
        setfilterleads(data?.lead);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle errors
      });
  };

  const exportToExcel1 = () => {
    const columnsForExport = columns.map((column) => ({
      title: column.name,
      dataIndex: column.selector,
    }));

    const dataForExport = filterleads.map((row) =>
      columns.map((column) => {
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
    link.download = "table.xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const columnsForExport = columns
      .filter((column) => column.name !== "Checkbox") // Remove the Checkbox column
      .map((column) => ({
        title: column.name === "" ? "Description" : column.name, // Change [object Object] to Description
        dataIndex: column.selector,
      }));

    const dataForExport = filterleads.map((row) =>
      columns
        .filter((column) => column.name !== "Checkbox") // Remove the Checkbox column
        .map((column) => {
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
    link.download = "table.xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const Refresh = () => {
    setTimeout(() => {
      window.location.reload(false);
    }, 500);
  };
  const getrowperpage = async (e) => {
    const newValue = e.target.value;
    setRowsPerPage(newValue);
  };

  return (
    <div>
      <div
        className="row justify-content-md-center"
        style={{ display: dataFromParent }}
      >
        <div className="col-md-12 advS">
          <form onSubmit={AdvanceSerch}>
            <div className="advfilter-wrap-box">
              <div className="row justify-content-md-center">
                <div className="col-md-3 ">
                  <div className="form-group">
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setAdvanceSerch({ ...adSerch, Status: e.target.value })
                      }
                      name="Status"
                    >
                      <option>Status</option>
                      {Statusdata?.leadstatus?.map((status, key) => {
                        return (
                          <option value={status._id}>
                            {status.status_name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setAdvanceSerch({ ...adSerch, agent: e.target.value })
                      }
                      name="agent"
                    >
                      <option>Agent</option>
                      <option value="Unassigne">Unassigned Agent</option>
                      {agent?.agent?.map((agents, key) => {
                        return (
                          <option value={agents._id}>
                            {agents.agent_name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <input
                      type="date"
                      placeholder="Date To"
                      className="form-control"
                      onChange={(e) =>
                        setAdvanceSerch({
                          ...adSerch,
                          startDate: e.target.value,
                        })
                      }
                      name="startDate"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <input
                      type="date"
                      placeholder="Date Till"
                      onChange={(e) =>
                        setAdvanceSerch({ ...adSerch, endDate: e.target.value })
                      }
                      className="form-control"
                      name="endDate"
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <button type="submit" className="btn-advf-sub">
                      Submit
                    </button>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <button onClick={Refresh} className="btn-advf-refresh">
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="export-wrap">
            {isAdmin1 ? (
              <>
                <button className="btn-ecport-pdf" onClick={exportToPDF}>
                  Export PDF
                </button>
                <button className="btn-ecport-xls" onClick={exportToExcel}>
                  Export Excel
                </button>
                <button className="btn-ecport-del" onClick={DeleteSelected}>
                  Delete
                </button>{" "}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      {quickEditModal}

      {status === false ? (
        <table
          id="example"
          className="table table-striped pt-3"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Number</th>
              <th>Agent</th>
              <th>Service</th>
              <th>Lead Source</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <p className="text-center">No Followup leads Founds</p>
            </tr>
          </tbody>
        </table>
      ) : (
        <>
          {isAdmin1 ? (
            <>
              <button className="btn-sel-all" onClick={handleCheckAll1}>
                Select All
              </button>
              <button className="btn-sel-one" onClick={handleCheckAll}>
                Select Per Page
              </button>
              <span class="btn btn-sm shadow_btn">Rows per page:</span>
              <select
                className="btn btn-sm shadow_btn  "
                value={rowsPerPage}
                onChange={getrowperpage}
              >
                <option value="10">10</option>

                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </>
          ) : (
            <>
              {" "}
              <button className="btn-sel-all" onClick={handleCheckAll1}>
                Select All
              </button>
              <button className="btn-sel-one" onClick={handleCheckAll}>
                Select Per Page
              </button>
              <span class="btn btn-sm shadow_btn">Rows per page:</span>
              <select
                className="btn btn-sm shadow_btn  "
                value={rowsPerPage}
                onChange={getrowperpage}
              >
                <option value="10">10</option>

                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </>
          )}
          <div>
            <DataTable
              key={rowsPerPage} // Add key prop to force re-render when rowsPerPage changes
              responsive
              id="table-to-export"
              columns={columns}
              data={filterleads}
              pagination
              paginationPerPage={rowsPerPage}
              fixedHeader
              fixedHeaderScrollHeight="550px"
              // selectableRows="single"
              highlightOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search here"
                  value={search}
                  onChange={(e) => setsearch(e.target.value)}
                  className="form-control w-25"
                />
              }
              onSelectedRowsChange={handleSelectedRowsChange}
              customStyles={customStyles}
              selectedRows={selectedRowIds}
              onChangePage={handlePageChange}
              striped
            />
          </div>
        </>
      )}
    </div>
  );
};
