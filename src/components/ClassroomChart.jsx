// frontend/src/components/ClassroomChart.jsx
import { useEffect, useRef, useState } from "react";
import { useClassrooms } from "../context/ClassroomContext";
import { getUsers } from "../services/api"; // Direct API call
import Chart from "chart.js/auto";
import { showToast } from "../utils/toast";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

function ClassroomChart() {
  const { t } = useTranslation();
  const { classrooms, loading: classroomsLoading } = useClassrooms();
  const [students, setStudents] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Fetch students on-demand
  useEffect(() => {
    const fetchStudents = async () => {
      setUsersLoading(true);
      try {
        const response = await getUsers({ role: "student" });
        setStudents(response.data);
      } catch (error) {
        showToast(t("failed_to_fetch_users"), "error");
        console.error("Error fetching students:", error);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchStudents();
  }, [t]);

  // Render chart when data is ready
  useEffect(() => {
    if (classroomsLoading || usersLoading || !chartRef.current) return;

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
            label: t("number_of_students"),
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
            title: { display: true, text: t("student_count") },
          },
          x: {
            title: { display: true, text: t("classroom") },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [classrooms, students, classroomsLoading, usersLoading, t]);

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
          {t("classroom_student_distribution")}
        </h1>
        <canvas
          ref={chartRef}
          aria-label={t("classroom_student_distribution_chart")}
        ></canvas>
      </div>
    </div>
  );
}

export default ClassroomChart;
