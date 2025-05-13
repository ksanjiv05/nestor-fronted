import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import queryString from "query-string";
import { Link, useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const PhotoLocationCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const uploadPhoto = async () => {
    try {
      const queries = queryString.parse(window.location.search);
      console.log("queries", queries);
      const blob = await (await fetch(photo)).blob();
      setLoader(true);
      const formData = new FormData();

      formData.append("lat", location.latitude);
      formData.append("lng", location.longitude);
      formData.append("user_id", localStorage.getItem("user_id"));
      formData.append("lead_id", queries.lead_id);
      formData.append("file", blob, queries.lead_id + ".png");
      const response = await axios.post(
        `${apiUrl}/create_geolocation`,
        formData
      );

      if (response.status == 200) {
        toast.success("uploaded Successfully!");
        navigate("/approval");
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };
  // Start the camera on mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
      }
    };

    startCamera();

    // Get location on mount
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        },
        (err) => console.error("Location access error:", err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  // Take a snapshot from video
  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0);
      const imageDataUrl = canvas.toDataURL("image/png");
      setPhoto(imageDataUrl);
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content">
        <div className="container pl-0">
          <div className="panel-body  pr-0">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>
                <h2>Photo & Location Capture</h2>

                {/* Video Stream */}
                <video ref={videoRef} autoPlay playsInline width="400" />

                {/* Hidden Canvas for Capturing Photo */}
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <br />

                {/* Take Photo Button */}
                <div style={{ display: "flex" }}>
                  <button onClick={takePhoto} className="btn btn-primary">
                    Take Photo
                  </button>

                  <div style={{ marginLeft: 8 }}>
                    {location ? (
                      <a
                        target="__blank"
                        href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                      >
                        {" "}
                        <p>
                          📍{location.latitude}, {location.longitude}
                        </p>
                      </a>
                    ) : (
                      <p>Getting location...</p>
                    )}
                  </div>
                </div>
                {/* Show Captured Photo */}
                {photo && (
                  <div>
                    <h3>Captured Photo:</h3>
                    <img src={photo} alt="Captured" width="400" />
                  </div>
                )}
                <button
                  disabled={loader}
                  onClick={uploadPhoto}
                  style={{ marginTop: 8 }}
                  className="btn btn-secondary"
                >
                  {loader ? "Uploading..." : "upload"}
                </button>

                {/* Show Location */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PhotoLocationCapture;
