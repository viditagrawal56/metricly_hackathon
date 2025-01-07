import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import "./Graphs.css";
import Navbar from "../Navbar/Navbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const chartColors = {
  primary: "#bb9bff",
  secondary: "#e9dfff",
  text: "#ececec",
  background: "rgba(255, 255, 255, 0.1)",
};

function Graph() {
  const generateMockData = () => {
    const startDate = new Date("2024-01-01");
    const endDate = new Date("2024-03-31");
    const posts = [];
    const postTypes = ["Reel", "Carousel", "Static"];

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const numPosts = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numPosts; i++) {
        const postType =
          postTypes[Math.floor(Math.random() * postTypes.length)];
        posts.push({
          Post_ID: `${date.toISOString().split("T")[0]}-${i + 1}`,
          Post_Type: postType,
          Likes: Math.floor(Math.random() * 2000) + 500,
          Shares: Math.floor(Math.random() * 500) + 100,
          Comments: Math.floor(Math.random() * 300) + 50,
          Date_Posted: date.toISOString().split("T")[0],
        });
      }
    }
    return posts;
  };

  const [data] = useState(generateMockData());

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 30,
      },
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: chartColors.text,
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
          boxWidth: window.innerWidth < 768 ? 12 : 16,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(236, 236, 236, 0.1)",
          display: window.innerWidth > 768,
        },
        ticks: {
          color: chartColors.text,
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: "rgba(236, 236, 236, 0.1)",
          display: window.innerWidth > 768,
        },
        ticks: {
          color: chartColors.text,
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
    },
  };
  const processedData = {
    distribution: {
      labels: ["Reel", "Carousel", "Static"],
      datasets: [
        {
          data: ["Reel", "Carousel", "Static"].map(
            (type) => data.filter((post) => post.Post_Type === type).length
          ),
          backgroundColor: [
            chartColors.primary,
            chartColors.secondary,
            "rgba(236, 236, 236, 0.6)",
          ],
        },
      ],
    },
    engagement: {
      labels: data.map((item) => item.Date_Posted).slice(-30),
      datasets: [
        {
          label: "Likes",
          data: data.map((item) => item.Likes).slice(-30),
          borderColor: chartColors.primary,
          tension: 0.4,
        },
        {
          label: "Shares",
          data: data.map((item) => item.Shares).slice(-30),
          borderColor: chartColors.secondary,
          tension: 0.4,
        },
      ],
    },
  };

  return (
    <div>
      <Navbar content="Chat With AI →" href="/chat" bool={false} />
      <div className="graph-container">
        <div className="chart-wrapper distribution">
          <h2>Post Distribution</h2>
          <Pie data={processedData.distribution} options={chartOptions} />
        </div>

        <div className="chart-wrapper performance">
          <h2>Performance by Type</h2>
          <Bar
            data={{
              labels: ["Reel", "Carousel", "Static"],
              datasets: [
                {
                  label: "Average Likes",
                  data: ["Reel", "Carousel", "Static"].map((type) => {
                    const typePosts = data.filter(
                      (post) => post.Post_Type === type
                    );
                    return (
                      typePosts.reduce((acc, post) => acc + post.Likes, 0) /
                      typePosts.length
                    );
                  }),
                  backgroundColor: chartColors.primary,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>

        <div className="chart-wrapper engagement">
          <h2>Engagement Trends</h2>
          <Line data={processedData.engagement} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default Graph;
