import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import companyLogo from "./avatar5.png";
function SideNav() {
  const location = useLocation();
  const userRole = localStorage.getItem("role");
  const [activeItem, setActiveItem] = useState("home");
  const [activeParent, setActiveParent] = useState("home");

  useEffect(() => {
    const pathname = window.location.pathname;
    const parts = pathname.split("/");
    const lastPart = parts[parts.length - 1];

    setActiveItem(`${lastPart}`);
  }, [location]);

  useEffect(() => {
    const getActiveParent = () => {
      if (activeItem === "ManageEmployee" || activeItem === "employeesreport") {
        return "callManage";
      }

      if (
        activeItem === "Addlead" ||
        activeItem === "leads" ||
        activeItem === "followupleads" ||
        activeItem === "importedlead" ||
        activeItem === "newlead" ||
        activeItem === "hotlead"
      ) {
        return "lead";
      }

      if (
        activeItem === "GroupSms" ||
        activeItem === "History" ||
        activeItem === "buysms"
      ) {
        return "smsManage";
      }

      if (
        activeItem === "GroupSmsWtsp" ||
        activeItem === "HistoryWtsp" ||
        activeItem === "BuysmsWtsp" ||
        activeItem === "BusinessWA"
      ) {
        return "wtspManage";
      }

      if (activeItem === "housingapi") {
        return "allapi";
      }

      if (
        activeItem === "Incomereport" ||
        activeItem === "Callreport" ||
        activeItem === "Productreport"
      ) {
        return "Report";
      }
    };

    setActiveParent(getActiveParent());
  }, [activeItem]);

  function handleParentClick(value) {
    setActiveParent(value);
  }

  return (
    <div>
      <side className="main-sidebar sidebar-dark-primary bg-menu-theme elevationes-4">
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel ">
            <div className="image">
              <div className="image pull-center">
                <img src={companyLogo} alt="BigCo Inc. logo" />
                <div className="welcome_agent">
                  <h4>Welcome</h4>
                  <p>
                    {localStorage.getItem("agent_name")}(
                    {localStorage.getItem("role")})
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="scroll-bar-wrap">
            <div className="scroll-box">
              <nav className="mt-2">
                <ul
                  className="nav nav-pills nav-sidebar flex-column"
                  data-widget="treeview"
                  role="menu"
                  data-accordion="false"
                >
                  <li className="nav-item">
                    <ul className="nav nav-treeview">
                      <li className="nav-item">
                        <Link to="/home" className="nav-link">
                          <i className="far fa-circle nav-icon" />
                          Dashboard
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="" className="nav-link">
                          <i className="fa fa-circle nav-icon" />
                          Top Navigation + Sidebar
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to=" " className="nav-link">
                          <i className="fa fa-circle nav-icon" />
                          Boxed
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="" className="nav-link">
                          <i className="far fa-circle nav-icon" />
                          Fixed Sidebar
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="" className="nav-link">
                          <i className="far fa-circle nav-icon" />
                          Fixed Sidebar <small>+ Custom Area</small>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="" className="nav-link">
                          <i className="far fa-circle nav-icon" />
                          Fixed Navbar
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="" className="nav-link">
                          <i className="far fa-circle nav-icon" />
                          Fixed Footer
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to=" " className="nav-link">
                          <i className="far fa-circle nav-icon" />
                          Collapsed Sidebar
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <>
                    <li className="nav-item">
                      <Link
                        to="/home"
                        className={
                          activeItem === "home" ? "nav-link active" : "nav-link"
                        }
                      >
                        <i className="nav-icon fas fa fa-home" />
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="#"
                        className="nav-link"
                        onClick={() => handleParentClick("lead")}
                      >
                        <i className="nav-icon fas fa fa-user-md" />
                        Lead
                        <i className="fas fa-angle-left right" />
                      </Link>
                      <ul
                        className="nav nav-treeview"
                        style={{
                          display: activeParent === "lead" ? "block" : "none",
                        }}
                      >
                        {(userRole === "admin" ||
                          userRole === "TeamLeader" ||
                          userRole === "GroupLeader") && (
                          <li className="nav-item">
                            <Link
                              to="/Addlead"
                              className={
                                activeItem === "Addlead"
                                  ? "nav-link active"
                                  : "nav-link"
                              }
                            >
                              <p>Add Lead</p>
                            </Link>
                          </li>
                        )}
                        <li className="nav-item">
                          <Link
                            to="/leads"
                            className={
                              activeItem === "leads"
                                ? "nav-link active"
                                : "nav-link"
                            }
                          >
                            <p>All Leads</p>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to="/followupleads"
                            className={
                              activeItem === "followupleads"
                                ? "nav-link active"
                                : "nav-link"
                            }
                          >
                            <p> Followup Leads</p>
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link
                            to="/newlead"
                            className={
                              activeItem === "newlead"
                                ? "nav-link active"
                                : "nav-link"
                            }
                          >
                            <p> New Leads</p>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to="/hotlead"
                            className={
                              activeItem === "hotlead"
                                ? "nav-link active"
                                : "nav-link"
                            }
                          >
                            <p> Hot Lead</p>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to="/approval"
                            className={
                              activeItem === "approval"
                                ? "nav-link active"
                                : "nav-link"
                            }
                          >
                            <p>Approval</p>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to="/importedlead"
                            className={
                              activeItem === "importedlead"
                                ? "nav-link active"
                                : "nav-link"
                            }
                          >
                            <p> Imported Lead</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="#"
                        className="nav-link "
                        onClick={() => handleParentClick("callManage")}
                      >
                        <i className="nav-icon fas fa fa fa-cog" />
                        Call Manage
                        <i className="fas fa-angle-left right" />
                      </Link>
                      <ul
                        className="nav nav-treeview"
                        style={{
                          display:
                            activeParent === "callManage" ? "block" : "none",
                        }}
                      >
                        <li className="nav-item">
                          <Link
                            to="/ManageEmployee"
                            className={
                              activeItem === "ManageEmployee"
                                ? "nav-link active"
                                : "nav-link"
                            }
                          >
                            <p>Employees</p>
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link
                            to="/employeesreport"
                            className={
                              activeItem === "employeesreport"
                                ? "nav-link active"
                                : "nav-link"
                            }
                          >
                            <p> Employees Report</p>
                          </Link>
                        </li>
                      </ul>
                    </li>

                    {/* manage sms start */}
                    {(userRole === "admin" || userRole === "TeamLeader") && (
                      <li className="nav-item">
                        <Link
                          to="#"
                          className="nav-link"
                          onClick={() => handleParentClick("smsManage")}
                        >
                          <i className="nav-icon fas fa fa fa-cog" />
                          SMS Panel
                          <i className="fas fa-angle-left right" />
                        </Link>
                        <ul
                          className="nav nav-treeview"
                          style={{
                            display:
                              activeParent === "smsManage" ? "block" : "none",
                          }}
                        >
                          <li className="nav-item">
                            <Link
                              to="/GroupSms"
                              className={
                                activeItem === "GroupSms"
                                  ? "nav-link active"
                                  : "nav-link"
                              }
                            >
                              <p>Compose SMS</p>
                            </Link>
                          </li>

                          <li className="nav-item">
                            <Link
                              to="/History"
                              className={
                                activeItem === "History"
                                  ? "nav-link active"
                                  : "nav-link"
                              }
                            >
                              <p> SMS Report</p>
                            </Link>
                          </li>
                        </ul>
                      </li>
                    )}

                    {/* <li className="nav-item">
                          <Link
                            to="/buysms"
                            className={
                              activeItem === "buysms"
                                ? "nav-link active"
                                : "nav-link"
                            }
                          >
                            <p> SMS Pack</p>
                          </Link>
                        </li> */}
                    {/* </ul>
                      </li>
                    )} */}

                    {/* manage sms end */}

                    {/* manage Wtsp start */}
                    {(userRole === "admin" || userRole === "TeamLeader") && (
                      <li className="nav-item">
                        <Link
                          to="#"
                          className="nav-link inactive"
                          onClick={() => handleParentClick("wtspManage")}
                        >
                          <i className="nav-icon fas fa fa fa-cog" />
                          What's App
                          <i className="fas fa-angle-left right" />
                        </Link>
                        <ul
                          className="nav nav-treeview"
                          style={{
                            display:
                              activeParent === "wtspManage" ? "block" : "none",
                          }}
                        >
                          <li className="nav-item">
                            <Link
                              to="/GroupSmsWtsp"
                              className={
                                activeItem === "GroupSmsWtsp"
                                  ? "nav-link active"
                                  : "nav-link"
                              }
                            >
                              <p>Compose What's App</p>
                            </Link>
                          </li>

                          <li className="nav-item">
                            <Link
                              to="/HistoryWtsp"
                              className={
                                activeItem === "HistoryWtsp"
                                  ? "nav-link active"
                                  : "nav-link"
                              }
                            >
                              <p> What's App Report</p>
                            </Link>
                          </li>
                        </ul>
                      </li>
                    )}
                    {/* {(userRole === "admin" ||
                      userRole === "TeamLeader" ||
                      userRole === "GroupLeader") && ( */}
                    {/* <li className="nav-item">
                      <Link
                        // style={{ display: "flex" }}
                        to="/attendence"
                        className={
                          activeItem === "attendence"
                            ? "nav-link active"
                            : "nav-link"
                        }
                      >
                        <i className="nav-icon fas fa fa-user-md" />
                        Attendence
                      </Link>
                    </li> */}

                    {/* manage Wtsp end */}
                    {(userRole === "admin" || userRole === "TeamLeader") && (
                      <li className="nav-item" style={{ display: "none" }}>
                        <Link
                          to="/UploadContent"
                          className={
                            activeItem === "UploadContent"
                              ? "nav-link active"
                              : "nav-link"
                          }
                        >
                          <i className="nav-icon far fa-credit-card" />
                          Contact's
                        </Link>
                      </li>
                    )}

                    {/* Api  */}
                    {/* <li className="nav-item">
                      <Link
                        to="#"
                        className="nav-link"
                        onClick={() => handleParentClick("allapi")}
                      >
                        <i className="nav-icon fas fa fa fa-cog" />
                        Api
                        <i className="fas fa-angle-left right" />
                      </Link>
                      <ul
                        className="nav nav-treeview"
                        style={{
                          display: activeParent === "allapi" ? "block" : "none",
                        }}
                      >
                        <li className="nav-item">
                          <Link
                            to="/housingapi"
                            className={
                              activeItem === "housingapi"
                                ? "nav-link active"
                                : "nav-link"
                            }
                          >
                            <p>Housing Api</p>
                          </Link>
                        </li>
                      </ul>
                    </li> */}
                    {/* Api */}
                    <li className="nav-item">
                      <Link
                        to="/productservices"
                        className={
                          activeItem === "productservices"
                            ? "nav-link active"
                            : "nav-link"
                        }
                      >
                        <i className="nav-icon far fa-credit-card" />
                        Product & Services
                      </Link>
                    </li>

                    {/* <li className="nav-item">
                    <a href="" className={activeItem === 'Report' ? 'nav-link active' : 'nav-link'}
                      onClick={() => handleItemClick('Report')}>
                      <i className="nav-icon far fa-file" />
                      Report
                    </a>
                  </li> */}

                    {/* for report  */}
                    <li className="nav-item">
                      <Link
                        to="#"
                        className="nav-link"
                        onClick={() => handleParentClick("Report")}
                      >
                        <i className="nav-icon fas fa fa-user-md" />
                        Report's
                        <i className="fas fa-angle-left right" />
                      </Link>
                      <ul
                        className="nav nav-treeview"
                        style={{
                          display: activeParent === "Report" ? "block" : "none",
                        }}
                      >
                        <li className="nav-item">
                          <Link
                            to="/Incomereport"
                            className={
                              activeItem === "Incomereport"
                                ? "nav-link active"
                                : "nav-link"
                            }
                          >
                            <p>Manage Report</p>
                          </Link>
                        </li>
                        <li className="nav-item" style={{ display: "none" }}>
                          <Link
                            to="/Callreport"
                            className={
                              activeItem === "Callreport"
                                ? "nav-link active"
                                : "nav-link"
                            }
                          >
                            <p>Call Report</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    {/* for report */}
                    {userRole === "admin" && (
                      <li className="nav-item">
                        <Link
                          to="/Setting"
                          className={
                            activeItem === "Setting"
                              ? "nav-link active"
                              : "nav-link"
                          }
                        >
                          <i className="nav-icon far fa fa-cog" />
                          Setting
                        </Link>
                      </li>
                    )}
                  </>
                </ul>
              </nav>
            </div>{" "}
          </div>{" "}
        </div>
      </side>
    </div>
  );
}

export default SideNav;
