import { Tooltip } from "bootstrap";
import React, { useState } from "react";
import randomcolor from "randomcolor";
import { Link } from "react-router-dom";
import LineChart from "./LineChart";
import LineChart1 from "./LineChart1";
import { getAllAgent, getAllAgentWithData } from "../features/agentSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";
import { getAllLeadSource } from "../features/leadSource";
import axios from "axios";
import MyCalendar from "../components/Pages/MonthlyCalendar";
import Notification from "./Notification";
import CallBarchart from "./Pages/CallBarchart";
// import toast from "react-hot-toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Home() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const DBuUrl = process.env.REACT_APP_DB_URL;
  const [Sale, setSale] = useState([]);
  const [leadsource, setleadsource] = useState([]);
  const [leadsourcedata1, setleadsourcedata] = useState([]);
  var { agent } = useSelector((state) => state.agent);
  const { leadSourcedata } = useSelector((state) => state.leadSource);
  const [agentss, setAgents] = useState([]);
  const [filterAgentss, setFilteredAgents] = useState([]);
  const [selectedGroupLeader, setSelectedGroupLeader] = useState("");
  const dispatch = useDispatch();
  console.log("agentssssssssstlllll", agentss);
  const [agentDetails, setAgentDetails] = useState([]);
  const userRole = localStorage.getItem("role");
  const [leadcountdataa, setLeadCountDataa] = useState([]);
  const [filterLeads, setFilterLeads] = useState([]);
  const [filterleads, setfilterleads] = useState([]);
  const [followupLeadCount, setFollowupLeadCount] = useState(0);
  const [notifiedMeetings, setNotifiedMeetings] = useState(new Set());
  const [notifiedCalls, setNotifiedCalls] = useState(new Set());
  const [dashboardLeadStats, setDashboardLeadStats] = useState([]);
  const [callLogs, setCallLogs] = useState([]);

  const getCallLogs = async () => {
    try {
      const response = await axios.get(`${apiUrl}/call_report`);
      console.log("response", response.data);
      setCallLogs(response.data.callLogs);
    } catch (error) {
      console.log("error in getCallLogs");
    }
  };
  useEffect(() => {
    getCallLogs();
  }, []);
  const test_data = {
    series: [44, 55, 13, 43, 22],
    options: {
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
    },
  };
  const getDashboardStats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/dashboardLeadStats/`);
      console.log("response", response);
      setDashboardLeadStats(response.data);
    } catch (error) {
      console.log("error in getDashboardStats", error);
    }
  };

  const converTtime = (ffgfgf) => {
    const second = ffgfgf;
    const hours = Math.floor(second / 3600);
    const minutes = Math.floor((second % 3600) / 60);
    const remainingSeconds = second % 60;
    const timeconverted =
      hours + "h " + minutes + "m " + remainingSeconds + "s";
    return timeconverted;
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // const response = await axios.get(agentsApiUrl);
        const response = await axios.get(`${apiUrl}/get_all_agent/`);
        console.log("API response:", response.data);
        if (response.data.success) {
          const agentsData = response.data.agent || []; // Corrected key
          console.log("Agents data:", agentsData);
          setAgents(agentsData);
        } else {
          toast.warn(response.data.message);
        }
      } catch (error) {
        toast.warn("Error fetching agents");
      }
    };
    getDashboardStats();
    fetchAgents();
  }, []);

  const filterAgents = (agentsData) => {
    if (userRole === "admin") {
      return agentsData.filter((agent) => agent.role === "GroupLeader");
    }
    return [];
  };
  useEffect(() => {
    setFilteredAgents(filterAgents(agentss));
  }, [agentss, userRole]);

  // const handleGroupLeaderChange = (e) => {
  //   const selectedId = e.target.value;
  //   setSelectedGroupLeader(selectedId);

  //   if (selectedId) {
  //     // Call the function to fetch data based on selected GroupLeader ID
  //     GetUserCallAccordingToGroupLeader(selectedId);
  //   }
  // };
  const handleGroupLeaderChange = (e) => {
    const selectedId = e.target.value;
    setSelectedGroupLeader(selectedId);

    if (selectedId) {
      if (userRole === "admin") {
        GetUserCallAccordingToGroupLeader1(selectedId); // Call for Admin
      } else if (userRole === "GroupLeader") {
        handleTeamLeaderChange(selectedId); // Call for Group Leader
      } else if (userRole === "TeamLeader") {
        handleTeam1LeaderChange(selectedId); // Call for Group Leader
      }
    }
  };

  // Function for Group Leader change event
  const handleTeamLeaderChange = (selectedId) => {
    setSelectedGroupLeader(selectedId);
    if (selectedId) {
      GetUserCallAccordingToGroupLeader1(selectedId);
    }
  };
  const handleTeam1LeaderChange = (selectedId) => {
    setSelectedGroupLeader(selectedId);
    if (selectedId) {
      getHigstNoOfCall1();
    }
  };

  // Filter agents based on the user's role
  const filteredAgents = agentss.filter((agent) => {
    const loggedInUserId = localStorage.getItem("user_id"); // Assuming the logged-in user ID is stored in localStorage

    if (userRole === "admin") {
      return agent.role === "GroupLeader";
    } else if (userRole === "TeamLeader") {
      return agent.role === "user" && agent.assigntl === loggedInUserId;
    } else if (userRole === "GroupLeader") {
      return agent.role === "TeamLeader" && agent.assigntl === loggedInUserId;
    }
    return false;
  });
  useEffect(() => {
    const fetchData1 = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // dispatch(getAllAgent());
        dispatch(getAllLeadSource());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData1();

    if (localStorage.getItem("role") === "admin") {
      getSale();
      getAllLeadSourceOverview();
      dispatch(getAllAgent());
      // getHigstNoOfCall();
      GetAllUserCallLogByAdminId();
      getLeadCountData();
      AgentWishLeadCount1({
        role: localStorage.getItem("user_id"),
        user_id: localStorage.getItem("user_id"),
      });
    }
    if (localStorage.getItem("role") === "TeamLeader") {
      YearlySaleApiForTeamLeader();
      LeadSourceOverviewApiForTeamLeader();
      DashboardLeadCountOfUserByTeamLeader();
      dispatch(
        getAllAgentWithData({
          assign_to_agent: localStorage.getItem("user_id"),
        })
      );
      GetUserCallAccordingToTeamLeader(localStorage.getItem("user_id"));
      AgentWishLeadCount1({
        role: localStorage.getItem("user_id"),
        user_id: localStorage.getItem("user_id"),
      });
    }
    if (localStorage.getItem("role") === "GroupLeader") {
      YearlySaleApiForGroupLeader();
      LeadSourceOverviewApiForGroupLeader();
      DashboardLeadCountOfUserByGroupLeader();
      dispatch(
        getAllAgentWithData({
          assign_to_agent: localStorage.getItem("user_id"),
        })
      );
      GetUserCallAccordingToGroupLeader(localStorage.getItem("user_id"));
      AgentWishLeadCount1({
        role: localStorage.getItem("user_id"),
        user_id: localStorage.getItem("user_id"),
      });
    }
    if (localStorage.getItem("role") === "user") {
      YearlySaleApiForUser();
      LeadSourceOverviewApiForUser();
      DashboardLeadCountOfUser();
      dispatch(
        getAllAgent({ assign_to_agent: localStorage.getItem("user_id") })
      );
      getHigstNoOfCall();
      AgentWishLeadCount1({
        role: localStorage.getItem("user_id"),
        user_id: localStorage.getItem("user_id"),
      });
    }
  }, []);

  const [Detail, setDetail] = useState([]);
  const [LeadCount, setLeadCount] = useState([]);

  const AgentWishLeadCount1 = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/AgentWishLeadCount1`,
        {
          role: localStorage.getItem("role"),
          user_id: localStorage.getItem("user_id"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "mongodb-url": DBuUrl,
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setLeadCount(responce?.data?.Count);
    } catch (error) {
      console.log(error);
      setLeadCount(error.responce?.data?.Count);
    }
  };

  const getHigstNoOfCall = async () => {
    try {
      const responce = await axios.get(`${apiUrl}/GetAllUserCallLogById/`, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setDetail(responce?.data?.array);
    } catch (error) {
      console.log(error);
      setDetail(error.responce?.data?.array);
    }
  };
  const getHigstNoOfCall1 = async () => {
    try {
      const responce = await axios.get(`${apiUrl}/GetAllUserCallLogById/`, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      // setDetail(responce?.data?.array);
      setAgentDetails(responce?.data?.array || []);
    } catch (error) {
      console.log(error);
      setAgentDetails([]);
    }
  };
  const GetAllUserCallLogByAdminId = async () => {
    try {
      const responce = await axios.get(
        `${apiUrl}/GetAllUserCallLogByAdminId/`,
        {
          headers: {
            "Content-Type": "application/json",
            "mongodb-url": DBuUrl,
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setDetail(responce?.data?.array);
    } catch (error) {
      console.log(error);
      setDetail(error.responce?.data?.array);
    }
  };

  const GetUserCallAccordingToTeamLeader = async (assign_to_agent) => {
    try {
      const responce = await axios.post(
        `${apiUrl}/GetUserCallAccordingToTeamLeader`,
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
      // setAgentDetails(responce?.data?.array || []);
      setDetail(responce?.data?.array);
    } catch (error) {
      console.log(error);
      setDetail(error.responce?.data?.array);
      // setAgentDetails([]);
    }
  };
  const GetUserCallAccordingToTeamLeader1 = async (assign_to_agent) => {
    try {
      const responce = await axios.post(
        `${apiUrl}/GetUserCallAccordingToTeamLeader`,
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
      setAgentDetails(responce?.data?.array || []);
      // setDetail(responce?.data?.array);
    } catch (error) {
      console.log(error);
      // setDetail(error.responce?.data?.array);
      setAgentDetails([]);
    }
  };

  const GetUserCallAccordingToGroupLeader = async (assign_to_agent) => {
    try {
      const responce = await axios.post(
        `${apiUrl}/GetUserCallAccordingToGroupLeader`,
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
      // setAgentDetails(responce?.data?.array || []);
      setDetail(responce?.data?.array);
    } catch (error) {
      console.log(error);
      setDetail(error.responce?.data?.array);
      // setAgentDetails([]);
    }
  };
  const GetUserCallAccordingToGroupLeader1 = async (assign_to_agent) => {
    try {
      const responce = await axios.post(
        `${apiUrl}/GetUserCallAccordingToGroupLeader`,
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
      setAgentDetails(responce?.data?.array || []);
      // setDetail(responce?.data?.array );
    } catch (error) {
      console.log(error);
      // setDetail(error.responce?.data?.array);
      setAgentDetails([]);
    }
  };
  const getSale = async () => {
    try {
      const responce = await axios.get(`${apiUrl}/YearlySaleApi`, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setSale(responce?.data?.details);
    } catch (error) {
      console.log(error);
    }
  };

  const YearlySaleApiForTeamLeader = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/YearlySaleApiForTeamLeader`,
        {
          user_id: localStorage.getItem("user_id"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "mongodb-url": DBuUrl,
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setSale(responce?.data?.details);
    } catch (error) {
      console.log(error);
    }
  };
  const YearlySaleApiForGroupLeader = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/YearlySaleApiForGroupLeader`,
        {
          user_id: localStorage.getItem("user_id"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "mongodb-url": DBuUrl,
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setSale(responce?.data?.details);
    } catch (error) {
      console.log(error);
    }
  };

  const YearlySaleApiForUser = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/YearlySaleApiForUser`,
        {
          user_id: localStorage.getItem("user_id"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "mongodb-url": DBuUrl,
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setSale(responce?.data?.details);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllLeadSourceOverview = async () => {
    try {
      const responce = await axios.get(`${apiUrl}/lead_source_overview_api`, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setleadsourcedata(responce?.data?.Lead_source_count);
      setleadsource(responce?.data?.Lead_source_name);
    } catch (error) {
      console.log(error);
    }
  };
  const LeadSourceOverviewApiForTeamLeader = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/LeadSourceOverviewApiForTeamLeader`,
        {
          user_id: localStorage.getItem("user_id"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "mongodb-url": DBuUrl,
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setleadsourcedata(responce?.data?.Lead_source_count);
      setleadsource(responce?.data?.Lead_source_name);
    } catch (error) {
      console.log(error);
    }
  };
  const LeadSourceOverviewApiForGroupLeader = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/LeadSourceOverviewApiForGroupLeader`,
        {
          user_id: localStorage.getItem("user_id"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "mongodb-url": DBuUrl,
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setleadsourcedata(responce?.data?.Lead_source_count);
      setleadsource(responce?.data?.Lead_source_name);
    } catch (error) {
      console.log(error);
    }
  };
  const LeadSourceOverviewApiForUser = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/LeadSourceOverviewApiForUser`,
        {
          user_id: localStorage.getItem("user_id"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "mongodb-url": DBuUrl,
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setleadsourcedata(responce?.data?.Lead_source_count);
      setleadsource(responce?.data?.Lead_source_name);
    } catch (error) {
      console.log(error);
    }
  };

  const [leadcountdata, setleadcountdata] = useState({});
  const getLeadCountData = async () => {
    try {
      const responce = await axios.get(`${apiUrl}/DashboardLeadCount`, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setleadcountdata(responce?.data?.Count);
    } catch (error) {
      const message = await error?.response?.data?.message;
      if (
        message == "Client must be connected before running operations" ||
        message == "Internal Server Error"
      ) {
        // getLeadCountData();
      }
      console.log(error);
    }
  };
  const DashboardLeadCountOfUser = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/DashboardLeadCountOfUser`,
        {
          user_id: localStorage.getItem("user_id"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "mongodb-url": DBuUrl,
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setleadcountdata(responce?.data?.Count);
    } catch (error) {
      console.log(error);
      setleadcountdata(error.responce?.data?.Count);
    }
  };
  const DashboardLeadCountOfUserByTeamLeader = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/DashboardLeadCountOfUserByTeamLeader`,
        {
          user_id: localStorage.getItem("user_id"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "mongodb-url": DBuUrl,
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setleadcountdata(responce?.data?.Count);
    } catch (error) {
      console.log(error);
      setleadcountdata(error.responce?.data?.Count);
    }
  };
  const DashboardLeadCountOfUserByGroupLeader = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/DashboardLeadCountOfUserByGroupLeader`,
        {
          user_id: localStorage.getItem("user_id"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "mongodb-url": DBuUrl,
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setleadcountdata(responce?.data?.Count);
    } catch (error) {
      console.log(error);
      setleadcountdata(error.responce?.data?.Count);
    }
  };

  // for meeting notification
  const getAllLead11 = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get_All_Lead_Followup`, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const leads = response?.data?.lead;
      const filteredLeads = leads?.filter((lead) => lead?.type !== "excel");

      const currentTime = new Date();

      filteredLeads?.forEach((lead) => {
        const isMeeting = lead?.status_details?.[0]?.status_name === "Meeting";

        if (isMeeting) {
          const followupDate = new Date(lead?.followup_date);
          const oneHourBefore = new Date(
            followupDate.getTime() - 60 * 60 * 1000
          );
          if (currentTime >= oneHourBefore && currentTime <= followupDate) {
            if (!notifiedMeetings.has(lead._id)) {
              const minutesRemaining = Math.floor(
                (followupDate - currentTime) / (1000 * 60)
              );
              toast.info(
                <div>
                  <h4 className="font-bold">Upcoming Meeting Alert!</h4>
                  <p>Meeting with: {lead.full_name}</p>
                  <p>Time remaining: {minutesRemaining} minutes</p>
                </div>,
                {
                  position: "bottom-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  transition: toast.Slide,
                }
              );

              setNotifiedMeetings((prev) => new Set([...prev, lead._id]));
            }
          }
        }
      });

      // Original lead counting logic
      const leadsToCount = filteredLeads?.filter((lead) => {
        const followupDate = new Date(lead?.followup_date);
        const fiveMinutesBeforeFollowup = new Date(
          followupDate.getTime() - 5 * 60 * 1000
        );
        return currentTime >= fiveMinutesBeforeFollowup;
      });

      const followupLeadCount = leadsToCount?.length || 0;

      setLeadCountDataa([
        { name: "Followup Leadsy", Value: followupLeadCount },
      ]);
      setFilterLeads(filteredLeads);
      setFollowupLeadCount(followupLeadCount);

      console.log(" home Number of leads to count:", followupLeadCount);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getAllLead11();
    const intervalId = setInterval(getAllLead11, 30000); // Fetch every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  // for call notification

  const getAllLead111 = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get_All_Lead_Followup`, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const leads = response?.data?.lead;
      const filteredLeads = leads?.filter((lead) => lead?.type !== "excel");

      const currentTime = new Date();

      filteredLeads?.forEach((lead) => {
        const isMeeting =
          lead?.status_details?.[0]?.status_name === "Call Back";

        if (isMeeting) {
          const followupDate = new Date(lead?.followup_date);
          const oneHourBefore = new Date(
            followupDate.getTime() - 60 * 60 * 1000
          );
          if (currentTime >= oneHourBefore && currentTime <= followupDate) {
            if (!notifiedMeetings.has(lead._id)) {
              const minutesRemaining = Math.floor(
                (followupDate - currentTime) / (1000 * 60)
              );
              toast.success(
                <div>
                  <h4 className="font-bold">Upcoming Call Alert!</h4>
                  <p>Call with: {lead.full_name}</p>
                  <p>Time remaining: {minutesRemaining} minutes</p>
                </div>,
                {
                  position: "bottom-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  transition: toast.Slide,
                }
              );

              setNotifiedMeetings((prev) => new Set([...prev, lead._id]));
            }
          }
        }
      });

      // Original lead counting logic
      const leadsToCount = filteredLeads?.filter((lead) => {
        const followupDate = new Date(lead?.followup_date);
        const fiveMinutesBeforeFollowup = new Date(
          followupDate.getTime() - 5 * 60 * 1000
        );
        return currentTime >= fiveMinutesBeforeFollowup;
      });

      const followupLeadCount = leadsToCount?.length || 0;

      setLeadCountDataa([
        { name: "Followup Leadsx", Value: followupLeadCount },
      ]);
      setFilterLeads(filteredLeads);
      setFollowupLeadCount(followupLeadCount);

      console.log(" home Number of leads to count:", followupLeadCount);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getAllLead111();
    const intervalId = setInterval(getAllLead111, 30000); // Fetch every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  // const getAllUnassignLead=async()=>{
  //   try {
  //     const responce = await axios.get(
  //       `${apiUrl}/getAllUnassignLead`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "mongodb-url": DBuUrl,
  //       },
  //     }
  //     );
  //     setleadcountdata(responce?.data?.lead);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const colors = randomcolor({ count: leadsourcedata1.length });
  const options = {
    labels: leadsource,
    //colors: colors,
  };
  return (
    <div>
      <ToastContainer />
      {/* <Notification /> */}
      <div className="content-wrapper">
        <section className="content py-5">
          <div className="container ">
            <div className="row d-none">
              <div className="col-12 col-lg-6 col-md-6 col-xl-6 pl-0 ">
                <div className="cardbox02">
                  <div className="panel-body new_leads bd-panel">
                    <h2>New Lead</h2>
                    <p>16</p>
                  </div>
                  <div className="lead_img  align-items-center">
                    <img src="dist/img/Capture_Leads.png" />
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 col-md-6 col-xl-6 pl-0 ">
                <div className="cardbox02">
                  <div className="panel-body new_leads bd-panel">
                    <h2>UnAssigned Lead</h2>
                    <p>60</p>
                  </div>
                  <div className="lead_img  align-items-center">
                    <img src="dist/img/lead_img.png" />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              {Array?.isArray(leadcountdata) ? (
                leadcountdata?.map((leadcountdata1, index) =>
                  leadcountdata1?.name === "Followup Lead" ? (
                    <div
                      className="col-xs-6 col-sm-6 col-md-6 pl-0 dashboard-fixeds col-lg-4"
                      key={index}
                    >
                      <Link to="/followupleads">
                        <div
                          className={`buttons-30 border-lefts${index + 1} mb-4`}
                          role="button"
                        >
                          <div className="text-center pt-3">
                            <div className="flex items-center justify-center mx-auto text-red-500 bg-red-100 rounded-full size-14 dark:bg-red-500/20">
                              <i className="fa fa-solid fa-users text-red-500"></i>
                            </div>
                            <h6 className="mt-2 mb-2">
                              <span className="counter-value">
                                {leadcountdata1?.name}
                              </span>
                            </h6>
                            <p className="text-slate-500 dark:text-zink-200">
                              {leadcountdata1?.Value}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ) : leadcountdata1?.name === "Total Agent" ? (
                    localStorage.getItem("role") === "admin" ? (
                      <div
                        className="col-xs-6 col-sm-6 col-md-6 pl-0 dashboard-fixeds col-lg-4"
                        key={index}
                      >
                        <Link to="/Setting">
                          {" "}
                          <div
                            className={`buttons-30 border-lefts${
                              index + 1
                            } mb-4`}
                            role="button"
                          >
                            <div className="text-center pt-3">
                              <div className="flex items-center justify-center mx-auto  bg-green-100 rounded-full size-14 dark:bg-red-500/20">
                                <i className="fa fa-solid fa-user text-green-500"></i>
                              </div>
                              <h6 className="mt-2 mb-2">
                                <span className="counter-value">
                                  {leadcountdata1?.name}
                                </span>
                              </h6>
                              <p className="text-slate-500 dark:text-zink-200">
                                {leadcountdata1?.Value}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ) : (
                      <div
                        className="col-xs-6 col-sm-6 col-md-6 pl-0 dashboard-fixeds col-lg-4"
                        key={index}
                      >
                        <Link to="#">
                          {" "}
                          <div
                            className={`buttons-30 border-lefts${
                              index + 1
                            } mb-4`}
                            role="button"
                          >
                            <div className="text-center pt-3">
                              <div className="flex items-center justify-center mx-auto  bg-green-100 rounded-full size-14 dark:bg-red-500/20">
                                <i className="fa fa-solid fa-user text-green-500"></i>
                              </div>
                              <h6 className="mt-2 mb-2">
                                <span className="counter-value">
                                  {leadcountdata1?.name}
                                </span>
                              </h6>
                              <p className="text-slate-500 dark:text-zink-200">
                                {leadcountdata1?.Value}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )
                  ) : (
                    <></>
                  )
                )
              ) : (
                <p>Loading or No Data</p>
              )}
              {dashboardLeadStats.map((v, index) => {
                console.log("v", v);
                if (v._id == null) {
                  return <></>;
                }
                if (
                  v._id == "Meeting" ||
                  v._id == "Fresh" ||
                  v._id == "Pending" ||
                  v._id == "Won"
                ) {
                  return (
                    <div
                      className="col-xs-6 col-sm-6 col-md-6 pl-0 dashboard-fixeds col-lg-4"
                      key={index}
                    >
                      <Link>
                        {" "}
                        <div
                          className={`button-30 border-lefts${index + 1} mb-4`}
                          role="button"
                        >
                          <div className="text-center pt-3">
                            <div className="flex items-center justify-center mx-auto text-red-500 1 bg-custom-100 rounded-full size-14 dark:bg-red-500/20">
                              {index == 0 ? (
                                <i
                                  className={`fa fa-solid fa-lightbulb-o text-custom-500 2`}
                                ></i>
                              ) : index == 1 ? (
                                <i
                                  className={`fa fa-solid fa-calendar-check-o  text-purple-500 3`}
                                ></i>
                              ) : index == 2 ? (
                                <i
                                  className={`fa fa-solid fa-clock-o text-red-500 4`}
                                ></i>
                              ) : (
                                <i
                                  className={`fa fa-solid fa-handshake-o text-custom-500 5`}
                                ></i>
                              )}
                            </div>
                            <h6 className="mt-2 mb-2">
                              <span className="counter-value">{v._id}</span>
                            </h6>
                            <p className="text-slate-500 dark:text-zink-200">
                              {v.count}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                }
                return <></>;
              })}
            </div>
            <div className="row">
              <div
                className="col-xs-6 col-sm-6 col-md-6 col-lg-4 pl-0"
                style={{ display: "none" }}
              >
                <div className="panel panel-bd cardbox2">
                  <div className="panel-body bd-panel">
                    <div className="statistic-box">
                      <div className="d-flex gap-2 align-items-center">
                        <div className="badge rounded bg-label-primary p-1">
                          <i className="fa fa-money"></i>
                        </div>
                        <h6 className="mb-0">Yearly Sales</h6>
                      </div>
                      <h4>
                        {" "}
                        Rs. {Sale["0"]?.TotalAmountWon}(
                        <span className="count-number">
                          {" "}
                          {Sale["0"]?.Yearly_lead_count_for_won}{" "}
                        </span>
                        ){" "}
                      </h4>
                      <div className="progresse w-75" style={{ height: 4 }}>
                        <div
                          className="progress-bars"
                          role="progressbar"
                          style={{ width: "65%" }}
                          aria-valuenow={65}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-xs-6 col-sm-6 col-md-6 col-lg-4"
                style={{ display: "none" }}
              >
                <div className="panel panel-bd cardbox2">
                  <div className="panel-body bd-panel">
                    <div className="statistic-box">
                      <div className="d-flex gap-2 align-items-center">
                        <div className="badge rounded bg-label-info p-1">
                          <i className="fa fa-money"></i>
                        </div>
                        <h6 className="mb-0">Monthly Sales</h6>
                      </div>
                      <h4 className="my-2 pt-1">
                        {" "}
                        Rs. {Sale["0"]?.TotalAmountwonmanthely} (
                        <span className="count-number">
                          {" "}
                          {Sale["0"]?.wonleadforthirtyday_count_lead}{" "}
                        </span>
                        ){" "}
                      </h4>
                      <div className="progresse w-75" style={{ height: 4 }}>
                        <div
                          className="progress-bars bg-infos"
                          role="progressbar"
                          style={{ width: "65%" }}
                          aria-valuenow={65}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-xs-6 col-sm-6 col-md-6 col-lg-4"
                style={{ display: "none" }}
              >
                <div className="panel panel-bd cardbox2">
                  <div className="panel-body bd-panel">
                    <div className="statistic-box">
                      <div className="d-flex gap-2 align-items-center">
                        <div className="badge rounded bg-label-danger p-1">
                          <i className="fa fa-frown-o"></i>
                        </div>
                        <h6 className="mb-0">Miss Opportunity</h6>
                      </div>
                      <h5 className="my-2 pt-1">
                        Rs. {/* Rs. {Sale['0']?.TotalAmountLost}  */}(
                        <span className="count-number">
                          {Sale["0"]?.Yearly_lead_count_Lost}{" "}
                        </span>
                        ){" "}
                      </h5>
                      <div className="progresse w-75" style={{ height: 4 }}>
                        <div
                          className="progress-bars bg-danger"
                          role="progressbar"
                          style={{ width: "65%" }}
                          aria-valuenow={65}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div
                className="col-xs-6 col-sm-6 col-md-6 col-lg-3"
                style={{ display: "none" }}
              >
                <div className="panel panel-bd cardbox3">
                  <div className="panel-body bd-panel">
                    <div className="statistic-box text-center">
                      {" "}
                      <i className="fa fa-tasks fa-2x" />
                      <h4>ToDo</h4>
                      <h3>
                        {" "}
                        <span className="count-number" style={{ color: "red" }}>
                          1
                        </span>
                        / <span className="count-number">1 </span>{" "}
                      </h3>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* <div
                className="col-xs-6 col-sm-6 col-md-6 col-lg-3"
                style={{ display: "none" }}
              >
                <div className="panel panel-bd cardbox3">
                  <div className="panel-body bd-panel">
                    <div className="statistic-box text-center">
                      {" "}
                      <i className="fa fa-comments fa-2x" />
                      <h4>SMS Status</h4>
                      <h3>
                        <span className="count-number"> 4249 </span>{" "}
                      </h3>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
            {localStorage.getItem("role") === "admin" ||
            localStorage.getItem("role") === "GroupLeader" ? (
              <div className="row">
                <div className="col-md-6   mob-left-right col-xs-12">
                  <div className="row">
                    <div className="col-md-4 pd-top mobile-hids">
                      <label htmlFor="lead_source">Team Performance </label>
                    </div>
                    <div className="col-md-8 mob-left-right col-xs-12">
                      {localStorage.getItem("role") === "admin" ||
                      localStorage.getItem("role") === "GroupLeader" ? (
                        <div className="form-group">
                          <select
                            onChange={handleGroupLeaderChange}
                            value={selectedGroupLeader}
                            className="form-control"
                          >
                            <option value="">Select</option>
                            {filteredAgents.length > 0 ? (
                              filteredAgents.map((agent) => (
                                <option key={agent._id} value={agent._id}>
                                  {agent.agent_name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No agents found</option>
                            )}
                          </select>
                          <span className="text-danger ferror"> </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="col-md-6   mob-left-right col-xs-12">
                  <div className="row">
                    <div className="col-md-8 mob-left-right col-xs-12">
                      {localStorage.getItem("role") === "admin" ||
                      localStorage.getItem("role") === "GroupLeader" ? (
                        <div className="form-group">
                          {agentDetails.length > 0 ? (
                            <table>
                              <thead>
                                <tr>
                                  <th>Username</th>
                                  <th>Highest No of Calls</th>
                                  <th>Total Time</th>
                                  {/* <th>Average Time</th> */}
                                </tr>
                              </thead>
                              {/* <tbody>
                                        {agentDetails.map((detail) => (
                                          <tr key={detail.user_id}>
                                            <td>{detail.username}</td>
                                            <td>{detail.HigstNoOfCall}</td>
                                            <td>{detail.TotalTime}</td>
                                            <td>{detail.AvrageTime}</td>
                                          </tr>
                                        ))}
                                      </tbody> */}
                              <tfoot>
                                <tr>
                                  <td>
                                    <strong>Total</strong>
                                  </td>
                                  <td>
                                    {agentDetails.reduce(
                                      (acc, detail) =>
                                        acc + detail.HigstNoOfCall,
                                      0
                                    )}
                                  </td>
                                  <td>
                                    {converTtime(
                                      agentDetails.reduce(
                                        (acc, detail) => acc + detail.TotalTime,
                                        0
                                      )
                                    )}
                                  </td>
                                  {/* <td>{(
                                              agentDetails.reduce((acc, detail) => acc + detail.AvrageTime, 0) / (agentDetails.length || 1)
                                            ).toFixed(2)}</td>  */}
                                </tr>
                              </tfoot>
                            </table>
                          ) : (
                            <p>No agent details available</p>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {/* /.row */}
            {/* Main row */}

            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 pl-0">
                <div className="panel panel-bd lobidisable lobipanel lobipanel-sortable">
                  <div className="panel-heading ui-sortable-handle">
                    <div className="panel-title">
                      <h4>Calender</h4>
                      <div className="card card-primary">
                        <div className="card-body p-0">
                          <div id="calendar">
                            <MyCalendar />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div className="panel panel-bd lobidisable lobipanel lobipanel-sortable">
                  <div className="panel-heading ui-sortable-handle">
                    <div className="panel-title">
                      <h4>Leads Source Overview</h4>
                      {leadsourcedata1.length > 0 && leadsource.length > 0 && (
                        <Chart
                          options={{ labels: leadsource }}
                          series={leadsourcedata1}
                          // options={test_data.options}
                          // series={test_data.series}
                          type="pie"
                          width="100%"
                        />
                      )}
                      {/* <ApexCharts
                        options={test_data.options}
                        series={test_data.series}
                        type="pie"
                        width="100%"
                      ></ApexCharts> */}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-xs-12 col-sm-12 col-md-4 col-lg-4"
                style={{ display: "none" }}
              >
                <div className="panel panel-bd lobidisable lobipanel lobipanel-sortable">
                  <div className="panel-heading ui-sortable-handle">
                    <div className="panel-title">
                      <h4>Task</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div
                className="col-xs-12 col-sm-12 col-md-12 col-lg-12 pl-0  lobipanel-parent-sortable ui-sortable"
                data-lobipanel-child-inner-id="JboVwpEyCD"
                style={{ display: "none" }}
              >
                <div
                  className="panel panel-bd lobidrag bg-white lobipanel lobipanel-sortable"
                  data-inner-id="JboVwpEyCD"
                  data-index={0}
                >
                  <div className="panel-heading ui-sortable-handle">
                    <div className="panel-title">
                      <h4>Income Graph</h4>
                    </div>
                  </div>
                  <div className="panel-bodyes personales">
                    <LineChart1 />
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="row">
              <div
                className="col-xs-12 col-sm-12 col-md-12 col-lg-12 pl-0  lobipanel-parent-sortable ui-sortable"
                data-lobipanel-child-inner-id="JboVwpEyCD"
              >
                <div
                  className="panel panel-bd lobidrag bg-white lobipanel lobipanel-sortable"
                  data-inner-id="JboVwpEyCD"
                  data-index={0}
                >
                  <div className="panel-heading ui-sortable-handle">
                    <div className="panel-title">
                      <h4>Calling Graph</h4>
                    </div>
                  </div>
                  <div className="panel-bodyes personales">
                    <CallBarchart />
                  </div>
                </div>
              </div>
            </div> */}

            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 pl-0">
                <div className="panel panel-bd  bg-white">
                  <div className="panel-heading">
                    <div className="panel-title   d-flex justify-content-between">
                      <div className="card-title mb-0">
                        <h5 className="mb-0"> Employee Report</h5>
                        {/* <p className="since_list">Yesterday</p> */}
                      </div>
                      <div className="value_serve">
                        <div className="dropdown">
                          <button
                            className="btn p-0"
                            type="button"
                            id="sourceVisits"
                          >
                            <i className="fa fa-ellipsis-v fa-sm text-muted"></i>
                          </button>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a className="dropdown-item" href="">
                              Refresh
                            </a>
                            <a className="dropdown-item" href="">
                              Download
                            </a>
                            <a className="dropdown-item" href="">
                              View All
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="panel-body personal">
                    <div className="card-bodyes  ">
                      <ul className="p-0 m-0">
                        <li className="mb-1 d-flex justify-content-between align-items-center">
                          <div className="bg-label-success rounded"></div>
                          <div className="d-flex justify-content-between w-100 flex-wrap">
                            <div className="d-flex"></div>
                          </div>
                          <div className="d-flex justify-content-between w-100 flex-wrap">
                            <div className="d-flex"></div>
                          </div>
                        </li>
                        {callLogs?.map((Details, key) => {
                          if (!Details.user) {
                            return null;
                          }
                          console.log("details", Details);
                          const converttime = (second) => {
                            const hours = Math.floor(second / 3600);
                            const minutes = Math.floor((second % 3600) / 60);
                            const remainingSeconds = Math.floor(second % 60);
                            const timeconverted =
                              hours +
                              "h " +
                              minutes +
                              "m " +
                              remainingSeconds +
                              "s";
                            return timeconverted;
                          };
                          // Check if the user is a 'user' or not
                          const isUser =
                            localStorage.getItem("role") === "user";

                          // Check if the Details.user_id matches the logged-in user's user_id
                          const isCurrentUser =
                            Details.user_id === localStorage.getItem("user_id");

                          if (isUser && isCurrentUser) {
                            return (
                              <li className="mb-3 d-flex justify-content-between align-items-center">
                                <div className="bg-label-success rounded">
                                  <img
                                    src="img/user_img.jpg"
                                    alt="User"
                                    className="rounded-circle me-3"
                                    width="28"
                                  />
                                </div>
                                <div className="d-flex justify-content-between w-100 flex-wrap">
                                  <h6 className="mb-0 ms-3">
                                    {" "}
                                    {Details?.user.agent_name}(
                                    {Details?.user.role})
                                  </h6>
                                  <div className="d-flex"></div>
                                </div>
                                <div className="d-flex justify-content-between phone_btns w-100 flex-wrap">
                                  <h6 className="mb-0 ms-3">
                                    {" "}
                                    <i
                                      className="fa fa-phone"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    {Details?.number_of_calls}{" "}
                                  </h6>
                                  <div className="d-flex"></div>
                                </div>
                                <div className="d-flex  w-30">
                                  <h6 className="mb-0 ms-3">
                                    <span className="badge badge-primary light border-0">
                                      {converttime(Details?.duration)}
                                    </span>
                                  </h6>
                                  <div className="d-flex"></div>
                                </div>
                              </li>
                            );
                          } else if (!isUser) {
                            // Render for non-user role
                            return (
                              <li className="mb-3 d-flex justify-content-between align-items-center">
                                <div className="bg-label-success rounded">
                                  <img
                                    src="img/user_img.jpg"
                                    alt="User"
                                    className="rounded-circle me-3"
                                    width="28"
                                  />
                                </div>
                                <div className="d-flex justify-content-between w-100 flex-wrap">
                                  <h6 className="mb-0 ms-3">
                                    {" "}
                                    {Details?.user.agent_name} (
                                    {Details?.user.role})
                                  </h6>
                                  <div className="d-flex"></div>
                                </div>
                                <div className="d-flex justify-content-between phone_btns w-100 flex-wrap">
                                  <h6 className="mb-0 ms-3">
                                    {" "}
                                    <i
                                      className="fa fa-phone"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    {Details?.number_of_calls}{" "}
                                  </h6>
                                  <div className="d-flex"></div>
                                </div>
                                <div className="d-flex  w-30">
                                  <h6 className="mb-0 ms-3">
                                    <span className="badge badge-primary light border-0">
                                      {converttime(Details?.duration)}
                                    </span>
                                  </h6>
                                  <div className="d-flex"></div>
                                </div>
                              </li>
                            );
                          } else {
                            return null; // Render nothing if not a user and not the current user
                          }
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-xs-12 col-sm-12 col-md-6 col-lg-6"
                style={{ display: "none" }}
              >
                <div className="panel panel-bd  bg-white">
                  <div className="panel-heading">
                    <div className="panel-title   d-flex justify-content-between">
                      <div className="card-title mb-0">
                        <h5 className="mb-0"> All Leads Information</h5>
                        <p className="since_list"> Right Now</p>
                      </div>
                      <div className="value_serve">
                        <div className="dropdown">
                          <button
                            className="btn p-0"
                            type="button"
                            id="sourceVisits"
                          >
                            <i className="fa fa-ellipsis-v fa-sm text-muted"></i>
                          </button>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a className="dropdown-item" href="">
                              Refresh
                            </a>
                            <a className="dropdown-item" href="">
                              Download
                            </a>
                            <a className="dropdown-item" href="">
                              View All
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="panel-body personal">
                    <div className="card-bodyes  ">
                      <ul className="p-0 m-0">
                        <li className="mb-1 d-flex justify-content-between align-items-center">
                          <div className="bg-label-success rounded"></div>
                        </li>
                        {LeadCount?.map((LeadCount1, key) => {
                          return (
                            <li className="mb-3 d-flex justify-content-between align-items-center">
                              <div className="badge bg-label-secondaryess p-2 me-3 rounded svg-icons-prev">
                                <i
                                  className="fab fa fa-user"
                                  aria-hidden="true"
                                ></i>
                              </div>
                              <div className="d-flex justify-content-between w-100 flex-wrap">
                                <h6 className="mb-0 ms-3">
                                  {" "}
                                  {LeadCount1?.name} ({LeadCount1.role})
                                </h6>
                                <div className="d-flex"></div>
                              </div>
                              <div className="d-flex justify-content-between w-100 flex-wrap">
                                <div className="d-flex"></div>
                              </div>
                              <div className="d-flex  w-30">
                                <h6 className="mb-0 ms-3">
                                  {" "}
                                  <span className="badge badge-primaryess light border-0">
                                    {LeadCount1?.Value}
                                  </span>
                                </h6>
                                <div className="d-flex"></div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row pt-3">
              {/* <div className="col-xs-12 col-sm-12 col-md-4 pl-0">
                <div className="panel panel-bd bg-white">
                  <div className="panel-heading">
                    <div className="panel-title d-flex">
                      <h5>Best Value Services</h5>
                      <div className="value_serve">
                        <div className="dropdown">
                          <button className="btn p-0" type="button" id="sourceVisits">
                            <i className="fa fa-ellipsis-v fa-sm text-muted"></i>
                          </button>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a className="dropdown-item" href="">Refresh</a>
                            <a className="dropdown-item" href="">Download</a>
                            <a className="dropdown-item" href="">View All</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ul className="p-0 m-0 pt-3">
                      <li className="d-flex align-items-center mb-4">
                        <div class="badge bg-label-primary me-3 rounded p-2">
                          <i class="fa fa-wallet fa-sm"></i>
                        </div>
                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                          <div className="me-2">
                            <div className="d-flex align-items-center">
                              <h6 className="mb-0 me-1">Bhutani Infra</h6>
                            </div>

                          </div>
                          <div className="user-progress">
                            <p className="text-success fw-medium mb-0 d-flex justify-content-center gap-1">
                            </p>
                          </div>
                        </div>
                      </li>
                      <li className="d-flex align-items-center mb-4">
                        <div class="badge bg-label-primary me-3 rounded p-2">
                          <i class="fa fa-wallet fa-sm"></i>
                        </div>
                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                          <div className="me-2">
                            <div className="d-flex align-items-center">
                              <h6 className="mb-0 me-1">DLF</h6>
                            </div>

                          </div>
                          <div className="user-progress">
                            <p className="text-danger fw-medium mb-0 d-flex justify-content-center gap-1">
                            </p>
                          </div>
                        </div>
                      </li>

                      <li className="d-flex align-items-center mb-4">
                        <div class="badge bg-label-primary me-3 rounded p-2">
                          <i class="fa fa-wallet fa-sm"></i>
                        </div>
                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                          <div className="me-2">
                            <div className="d-flex align-items-center">
                              <h6 className="mb-0 me-1">M3M</h6>
                            </div>

                          </div>
                          <div className="user-progress">
                            <p className="text-success fw-medium mb-0 d-flex justify-content-center gap-1">
                            </p>
                          </div>
                        </div>
                      </li>
                      <li className="d-flex align-items-center mb-4">
                        <div class="badge bg-label-primary me-3 rounded p-2">
                          <i class="fa fa-wallet fa-sm"></i>
                        </div>
                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                          <div className="me-2">
                            <div className="d-flex align-items-center">
                              <h6 className="mb-0 me-1">Godrej Properties</h6>
                            </div>

                          </div>
                          <div className="user-progress">
                            <p className="text-success fw-medium mb-0 d-flex justify-content-center gap-1">
                            </p>
                          </div>
                        </div>
                      </li>
                      <li className="d-flex align-items-center mb-4">
                        <div class="badge bg-label-primary me-3 rounded p-2">
                          <i class="fa fa-wallet fa-sm"></i>
                        </div>
                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                          <div className="me-2">
                            <div className="d-flex align-items-center">
                              <h6 className="mb-0 me-1">Tata Housing</h6>
                            </div>

                          </div>
                          <div className="user-progress">
                            <p className="text-success fotns_sizee fw-medium mb-0 d-flex align-items-center gap-1">
                             </p>
                          </div>
                        </div>
                      </li>

                    </ul>
                  </div>
                  <div className="panel-body personal Best Value d-none Services Best Value Services">
                    <ul className="emply bg-white" id="bvslist">
                      <li>1. E-Commerce (Rs. 15000.00)</li>
                      <li>2. (Rs. 0)</li>
                      <li>3. Real-Estate (Rs. 0)</li>
                      <li>4. WhatsApp (Rs. 0)</li>
                      <li>5. Website Maintenance Qtly (Rs. 0)</li>
                      <li>6. Website Maintenance (Rs. 0)</li>
                      <li>7. Web Hosting (Rs. 0)</li>
                      <li>8. Web Designing Development (Rs. 0)</li>
                      <li>9. Test Razor Pay (Rs. 0)</li>
                      <li>10. Staff Management Fee (Rs. 0)</li>
                    </ul>
                  </div>
                </div>
              </div> */}

              {/* <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div className="panel panel-bd bg-white">
                  <div className="panel-heading">
                    <div className="panel-title">
                      <h5>System Information</h5>
                    </div>
                  </div>
                  <div className="panel-body">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>Current Version</td>
                          <th>18.2.0</th>
                        </tr>
                        <tr>
                          <td>Latest Version</td>
                          <th>18.4.0</th>
                        </tr>
                        <tr>
                          <td>React Version</td>
                          <th>18.2.0</th>
                        </tr>
                        <tr>
                          <td>Node Version</td>
                          <th>18.2.0</th>
                        </tr>
                        <tr>
                          <td>SignUp Date</td>
                          <th>01-01-2021 11:44:29 AM</th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div> */}

              <div
                className="d-none col-xs-12 col-sm-12 col-md-6 col-lg-6 lobipanel-parent-sortable ui-sortable"
                data-lobipanel-child-inner-id="gjY82eGUtA"
              >
                <div
                  className="panel panel-bd bg-white lobidrag lobipanel lobipanel-sortable"
                  data-inner-id="gjY82eGUtA"
                  data-index={0}
                >
                  <div className="panel-heading ui-sortable-handle">
                    <div
                      className="panel-title"
                      style={{ maxWidth: "calc(100% - 0px)" }}
                    >
                      <h5>Next Version Features</h5>
                    </div>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled mb-0">
                      <li className="mb-3 pb-1">
                        <div className="d-flex align-items-start">
                          <div className="badge bg-label-secondary p-2 me-3 rounded">
                            <i className="fa fa-globe fa-sm" />
                          </div>
                          <div className="d-flex justify-content-between w-100 flex-wrap gap-2">
                            <div className="me-2">
                              <h6 className="mb-0">Geo Tracking</h6>
                              {/* <small className="text-muted">Direct link click</small> */}
                            </div>
                            <div className="d-flex align-items-center">
                              {/* <p className="mb-0">1.2k</p>
                          <div className="ms-3 badge bg-label-success">+4.2%</div> */}
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="mb-3 pb-1">
                        <div className="d-flex align-items-start">
                          <div className="badge bg-label-secondary p-2 me-3 rounded">
                            <i className="fa fa-globe fa-sm" />
                          </div>
                          <div className="d-flex justify-content-between w-100 flex-wrap gap-2">
                            <div className="me-2">
                              <h6 className="mb-0">SMS Integration</h6>
                            </div>
                            <div className="d-flex align-items-center">
                              {/* <p className="mb-0">31.5k</p>
                          <div className="ms-3 badge bg-label-success">+8.2%</div> */}
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="mb-3 pb-1">
                        <div className="d-flex align-items-start">
                          <div className="badge bg-label-secondary p-2 me-3 rounded">
                            <i className="fa fa-envelope fa-sm" />
                          </div>
                          <div className="d-flex justify-content-between w-100 flex-wrap gap-2">
                            <div className="me-2">
                              <h6 className="mb-0">WhatsApp Integration</h6>
                            </div>
                            <div className="d-flex align-items-center">
                              {/* <p className="mb-0">893</p>
                          <div className="ms-3 badge bg-label-success">+2.4%</div> */}
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="mb-3 pb-1">
                        <div className="d-flex align-items-start">
                          <div className="badge bg-label-secondary p-2 me-3 rounded">
                            <i className="fa fa-globe  fa-sm" />
                          </div>
                          <div className="d-flex justify-content-between w-100 flex-wrap gap-2">
                            <div className="me-2">
                              <h6 className="mb-0">Calling Through System</h6>
                            </div>
                            <div className="d-flex align-items-center">
                              {/* <p className="mb-0">342</p>
                          <div className="ms-3 badge bg-label-danger">-0.4%</div> */}
                            </div>
                          </div>
                        </div>
                      </li>

                      <li className="mb-3 pb-1">
                        <div className="d-flex align-items-start">
                          <div className="badge bg-label-secondary p-2 me-3 rounded">
                            <i className="fa fa-globe  fa-sm" />
                          </div>
                          <div className="d-flex justify-content-between w-100 flex-wrap gap-2">
                            <div className="me-2">
                              <h6 className="mb-0">IOS App</h6>
                            </div>
                            <div className="d-flex align-items-center">
                              {/* <p className="mb-0">342</p>
                          <div className="ms-3 badge bg-label-danger">-0.4%</div> */}
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* /.row (main row) */}
          </div>
          {/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>
    </div>
  );
}

export default Home;
