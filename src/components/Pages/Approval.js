import React, { Fragment, useState, useEffect } from "react";
import { addlead, getAllLead } from "../../features/leadSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { Allleadstable } from "./Allleadstable";
import { Link } from "react-router-dom";
import { getAllAgent } from "../../features/agentSlice";
import { getAllStatus } from "../../features/statusSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { HotLeadtable } from "./HotLeadtable";
import { ApprovalTable } from "./ApprovalTable";
function Approval() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const { lead, loading } = useSelector((state) => state.lead);
  const { agent } = useSelector((state) => state.agent);
  const { Statusdata } = useSelector((state) => state.StatusData);
  const [LeadStatus, setLeadStatus] = useState();
  const [Leadagent, setLeadagent] = useState();
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(`${apiUrl}/get_all_agent/`);
        console.log('API response:', response.data);
        if (response.data.success) {
          const agentsData = response.data.agent || []; 
          console.log('Agents data:', agentsData);
          setAgents(agentsData);
        } else {
          toast.warn(response.data.message);
        }
      } catch (error) {
        toast.warn("Error fetching agents");
      }
    };

    fetchAgents();
  }, []);


  useEffect(() => {
    dispatch(getAllLead());
    dispatch(getAllStatus());
  }, []);
  //   const BulkAction = async (e) => {
  //     e.preventDefault();
  //     const updatedData = {
  //       leads,
  //       Leadagent,
  //       LeadStatus,
  //     };

  //     try {
  //       const response = await axios.put(
  //         `${apiUrl}/BulkLeadUpdate/`,
  //         updatedData
  //       );

  //       if (response.data.success === false) {
  //         toast.warn(response.data.message);
  //       }
  //       if (response.data.success === true) {
  //         // window.location.reload(false);
  //         toast.success(response.data.message);
  //       }
  //     } catch (error) {
  //       toast.warn(error.response?.data?.message);
  //       //  console.error('Error updating lead', error);
  //     }
  //   };
  const [leads, setLeadID] = useState([]);
  const [none, setnone] = useState("none");
  const handleChildData = (data) => {
    setLeadID(data);
  };

    const advanceserch = () => {
      if (none == "none") {
        setnone("block");
      } else {
        setnone("none");
      }
    };

  const userRole = localStorage.getItem("role");

  return (
    <div>
      <div className="content-wrapper">
        <section className="content">
          <div className="container pl-0">
            <div className="panel-body  pr-0">
              <div className="row export-data">
                {/* <div className="col-md-7 col-xs-12 ">
                  <div className="bulkaction-wrap">
                    <div className="ipades pt-2">
                      <form onSubmit={BulkAction}>
                        <div className="row">
                          <div className="col-md-3 col-sm-3 col-xs-12">
                            <div className="btne-group">
                              <p>Bulk Action</p>
                            </div>
                          </div>
                          <div className="col-md-4 col-sm-3 col-xs-12">
                            <select
                              className="form-control"
                              onChange={(e) =>
                                setLeadStatus({
                                  ...LeadStatus,
                                  status: e.target.value,
                                })
                              }
                              name="status"
                              id="status"
                              required
                            >
                              <option value>Change Status</option>
                              {Statusdata?.leadstatus?.map((status, key) => {
                                return (
                                  <option value={status._id}>
                                    {status.status_name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="col-md-3 col-sm-3 col-xs-12">
                            <select
                              className="form-control"
                              onChange={(e) =>
                                setLeadagent({
                                  ...Leadagent,
                                  agent: e.target.value,
                                })
                              }
                              name="agent"
                              id="agent"
                              required
                            >
                              <option value>Transfer to</option>

                              {agent?.agent?.map((agents, key) => {
                                return (
                                  <option value={agents._id}>
                                    {agents.agent_name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="col-md-2 col-sm-2 col-xs-12 pl-0">
                            <input
                              type="submit"
                              className="button-57"
                              defaultValue="Submit"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div> */}
                <div className="col-md-5 col-xs-12">
                  <div className="advfilter-wrap">
                    <div className="row">
                    {(localStorage.getItem("role") === "admin")&&(
                     
                     <div className="col-md-4 col-sm-4 mobil-nns col-xs-4">
                        <div>
                          <button className="btn-advf" onClick={advanceserch}>
                            <i class="fa fa-search" aria-hidden="true"></i>
                            &nbsp; Advance Filter{" "}
                          </button>
                        </div>
                      </div>
                     )}
                      {/* <div className="col-md-4 col-sm-4 col-xs-6">
                        <div>
                          <Link className="btn-advf" to="/Addlead">
                            {" "}
                            <i className="fa fa-plus" />
                            &nbsp; Add Lead{" "}
                          </Link>
                        </div>
                      </div> */}
                      <div className="col-md-4 col-sm-4 col-xs-6">
                        {/* {(userRole === "admin" ||
                          userRole === "TeamLeader") && (
                          <div className="btn-group btn-groupese">
                            <Link
                              className="btn btnes exports"
                              to="/import-lead"
                            >
                              <i className="fa fa-download" />
                              &nbsp; Import
                            </Link>
                          </div>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 row pl-0">
                <div className="col-12 pl-0">
                  <ApprovalTable
                    sendDataToParent={handleChildData}
                    dataFromParent={none}
                    isHotLead={true}
                    agents={agents}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Approval;
