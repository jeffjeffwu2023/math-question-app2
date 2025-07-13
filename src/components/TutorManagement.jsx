import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, softDeleteUser } from "../services/api"; // Updated import
import { showToast } from "../utils/toast";
import { useTranslation } from "react-i18next";
import Navigation from "./Navigation";

const TutorManagement = () => {
  const { t } = useTranslation();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tutorRes = await getUsers({ role: "tutor", disabled: false }); // Filter out disabled tutors
        setTutors(tutorRes.data);
      } catch (error) {
        showToast(t("failed_to_fetch_data"), "error");
        console.error("Error fetching data:", error);
        setError(t("failed_to_fetch_data"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  const handleRemoveTutor = (tutorId) => {
    setSelectedTutorId(tutorId);
    setShowModal(true);
  };

  const confirmRemoveTutor = async () => {
    if (selectedTutorId) {
      try {
        await softDeleteUser(selectedTutorId); // Use softDeleteUser
        showToast(t("tutor_removed_successfully"), "success");
        setTutors(tutors.filter((tutor) => tutor.id !== selectedTutorId));
        setShowModal(false);
        setSelectedTutorId(null);
      } catch (error) {
        showToast(t("failed_to_remove_tutor"), "error");
        console.error("Error removing tutor:", error);
      }
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-0 pr-4 pb-4 pl-4 sm:pr-6 sm:pb-6 sm:pl-6 md:pr-8 md:pb-8 md:pl-8">
      <Navigation />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-heading-lg">{t("tutor_management")}</h2>
          <div className="space-x-4">
            <Link
              to="/admin/tutor-management/add"
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors"
            >
              {t("add_tutor")}
            </Link>
            <Link
              to="/admin/tutor-management/assign"
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors"
            >
              {t("assign_students")}
            </Link>
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-heading-md mb-4">{t("tutor_list")}</h3>
              {tutors.length === 0 ? (
                <p>{t("no_tutors_found")}</p>
              ) : (
                <table className="w-full border-collapse shadow-md">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">{t("name")}</th>
                      <th className="border p-2 text-left">{t("email")}</th>
                      <th className="border p-2 text-left">
                        {t("assigned_students")}
                      </th>
                      <th className="border p-2 text-left">{t("action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tutors.map((tutor) => (
                      <tr key={tutor.id} className="hover:bg-gray-50">
                        <td className="border p-2">{tutor.name}</td>
                        <td className="border p-2">{tutor.email}</td>
                        <td className="border p-2">
                          {tutor.studentIds?.length || 0}
                        </td>
                        <td className="border p-2">
                          <button
                            onClick={() => handleRemoveTutor(tutor.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                          >
                            {t("remove")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4">{t("confirm_remove")}</h3>
              <p>{t("are_you_sure_remove_tutor")}</p>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={confirmRemoveTutor}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  {t("confirm_soft_delete")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorManagement;
