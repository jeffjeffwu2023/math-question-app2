// frontend/src/components/ClassroomChart.jsx
import { useEffect, useRef } from "react";
import { useClassrooms } from "../context/ClassroomContext";
import { useUsers } from "../context/UserContext";
import Chart from "chart.js/auto";
import { showToast } from "../utils/toast";
import { ClipLoader } from "react-spinners";

function ClassroomChart() {
  const { classrooms, loading: classroomsLoading } = useClassrooms();
  const { users, loading: usersLoading } = useUsers();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (classroomsLoading || usersLoading) return;

    const students = users.filter((u) => u.role === "student");
    const data = classrooms.map((classroom) => ({
      name: classroom.name,
      studentCount: students.filter((s) =>
        s.classroomIds?.includes(classroom.id)
      ).length,
    }));

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((d) => d.name),
        datasets: [
          {
            label: "Number of Students",
            data: data.map((d) => d.studentCount),
            backgroundColor: "rgba(99, 102, 241, 0.5)",
            borderColor: "rgba(99, 102, 241, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Student Count" },
          },
          x: {
            title: { display: true, text: "Classroom" },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [classrooms, users, classroomsLoading, usersLoading]);

  if (classroomsLoading || usersLoading) {
    return (
      <div className="flex justify-center p-6">
        <ClipLoader color="#2563eb" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-6">
          Classroom Student Distribution
        </h1>
        <canvas
          ref={chartRef}
          aria-label="Classroom Student Distribution Chart"
        ></canvas>
      </div>
    </div>
  );
}

export default ClassroomChart;
