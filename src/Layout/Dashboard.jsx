import React, { useEffect, useState } from "react";
import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "../Style/DashBoard.css";
import {
  FaInbox,
  FaPaw,
  FaPlusCircle,
  FaEye,
  FaTachometerAlt,
  FaDonate,
  FaStar
} from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";
import api from "../configs/axios";

function Dashboard() {
  const [donation, setDonation] = useState(0);
  const [adopted, setAdopted] = useState(0);
  const [pending, setPending] = useState(0);
  const [available, setAvailable] = useState(0);
  const [requestByMonth, setRequestByMonth] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [emergencyData, setEmergencyData] = useState([]);
  const [petTypes, setPetTypes] = useState([]);
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  const [reviewCount, setReviewCount] = useState(0);


  const location = useLocation();

  const fetchData = () => {
    // Tổng tiền donation
    api.get("/Donate/total")
      .then(res => setDonation(res.data.result || 0))
      .catch(err => console.error("Lỗi khi lấy tổng donation:", err));

    // Số lượng thú cưng theo trạng thái
    Promise.all([
      api.get("/Pet/adopted"),
      api.get("/Pet/pending"),
      api.get("/Pet/available")
    ])
      .then(([adoptedRes, pendingRes, availableRes]) => {
        const adopted = adoptedRes.data.result || 0;
        const pending = pendingRes.data.result || 0;
        const available = availableRes.data.result || 0;

        setAdopted(adopted);
        setPending(pending);
        setAvailable(available);
        setPetTypes([adopted, pending, available]);

        setPieData({
          labels: ["Đã nhận nuôi", "Đang xử lý", "Sẵn sàng nhận nuôi"],
          datasets: [
            {
              data: [adopted, pending, available],
              backgroundColor: ["#42a5f5", "#ffb74d", "#66bb6a"],
              hoverOffset: 15,
            },
          ],
        });
      })
      .catch(err => console.error("Lỗi khi lấy dữ liệu thú cưng:", err));

    // Revenue theo tháng
    api.get("/Donate/by-month")
      .then(res => {
        const raw = res.data.result || [];
        const monthlyRevenue = Array(12).fill(0);
        raw.forEach(item => {
          monthlyRevenue[item.month - 1] = item.totalAmount;
        });
        setRevenueData(monthlyRevenue);
      })
      .catch(err => console.error("Lỗi khi lấy revenue:", err));

    // Yêu cầu nhận nuôi theo tháng
    api.get("/AdoptionRequest/by-month")
      .then(res => {
        const raw = res.data.result || [];
        const monthlyRequests = Array(12).fill(0);
        raw.forEach(item => {
          monthlyRequests[item.month - 1] = item.count;
        });
        setRequestByMonth(monthlyRequests);
      })
      .catch(err => console.error("Lỗi khi lấy adoption request:", err));

    // Báo cáo khẩn cấp theo tháng
    api.get("/EmergencyReport/monthly-counts")
      .then(res => {
        const raw = res.data.result || [];
        const monthlyEmergency = Array(12).fill(0);
        raw.forEach(item => {
          monthlyEmergency[item.month - 1] = item.count;
        });
        setEmergencyData(monthlyEmergency);
      })
      .catch(err => console.error("Lỗi khi lấy báo cáo khẩn cấp:", err));

api.get("/Review/all")
  .then(res => {
    const reviews = Array.isArray(res.data.result)
      ? res.data.result
      : Array.isArray(res.data)
        ? res.data
        : [];

    setReviewCount(reviews.length);
  })
  .catch(err => console.error("Lỗi khi lấy review:", err));


  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const menu = [
    { to: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { to: "/manage-pet", icon: <FaPaw />, label: "Thú cưng" },
    { to: "/create-pet", icon: <FaPlusCircle />, label: "Thêm mới" },
    { to: "/manage-request", icon: <FaInbox />, label: "Yêu cầu nhận nuôi" },
    { to: "/manage-emergency", icon: <FaEye />, label: "Báo cáo khẩn cấp" },
    { to: "/manage-donate", icon: <FaDonate />, label: "Quản lý donation" },
    { to: "/manage-reviewer", icon: <FaStar />, label: "Quản lý đánh giá" },
  ];

  const barData = {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
    datasets: [
      {
        label: "Yêu cầu nhận nuôi",
        data: requestByMonth,
        backgroundColor: "#633479",
        borderRadius: 6,
      },
    ],
  };

  const lineData = {
    labels: barData.labels,
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: revenueData,
        fill: true,
        backgroundColor: "rgba(99, 52, 121, 0.1)",
        borderColor: "#633479",
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: "#633479",
      },
    ],
  };

  const doughnutData = {
    labels: ["Đã nhận nuôi", "Đang xử lý", "Sẵn sàng nhận nuôi"],
    datasets: [
      {
        data: petTypes,
        backgroundColor: ["#ffa726", "#42a5f5", "#ab47bc"],
        borderWidth: 0,
      },
    ],
  };

  const emergencyChartData = {
    labels: barData.labels,
    datasets: [
      {
        label: "Báo cáo khẩn cấp",
        data: emergencyData,
        backgroundColor: "#e91e63",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="management-page">
      <aside className="sidebar">
        <h2>
          <FaPaw /> Quản lý
        </h2>
        <ul>
          {menu.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={
                  "sidebar-link" + (location.pathname === item.to ? " active" : "")
                }
              >
                {item.icon} {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <div className="main-content">
        <h1 className="page-title">Admin Dashboard</h1>

        <div className="stats-cards">
          <div className="stat-card">
            <FaPaw className="card-icon" />
            <div>
              <h3>Thú cưng đã nhận nuôi</h3>
              <p>{adopted}</p>
            </div>
          </div>

          <div className="stat-card">
            <FaInbox className="card-icon" />
            <div>
              <h3>Thú cưng chờ nhận nuôi</h3>
              <p>{pending}</p>
            </div>
          </div>
                    <div className="stat-card">
            <FaInbox className="card-icon" />
            <div>
              <h3>Thú cưng sẵn sàng để nhận nuôi</h3>
              <p>{available}</p>
            </div>
          </div>

          <div className="stat-card">
            <FaDonate className="card-icon" />
            <div>
              <h3>Tiền donate</h3>
              <p>{donation.toLocaleString()} đ</p>
            </div>
          </div>
          <div className="stat-card">
  <FaStar className="card-icon" />
  <div>
    <h3>Lượt đánh giá</h3>
    <p>{reviewCount}</p>
  </div>
</div>

        </div>

        <div className="charts-grid">
          <div className="chart-container">
            <h3>Trạng thái thú cưng</h3>
            <Pie data={pieData} />
          </div>

          <div className="chart-container">
            <h3>Doanh thu theo tháng</h3>
            <Line data={lineData} />
          </div>

          <div className="chart-container">
            <h3>Yêu cầu nhận nuôi</h3>
            <Bar data={barData} />
          </div>

          <div className="chart-container">
            <h3>Loại thú cưng</h3>
            <Doughnut data={doughnutData} />
          </div>

          <div className="chart-container">
            <h3>Báo cáo khẩn cấp</h3>
            <Bar data={emergencyChartData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
