import { useNavigate } from "react-router";
import { useInterview } from "../features/interview/hooks/useInterview";
import { useAuth } from "../features/auth/hooks/useAuth";

export default function Dashboard() {

  const navigate = useNavigate();
  const { reports } = useInterview();
const { handleLogout } = useAuth();
  const totalReports = reports.length;

  const avgScore =
    reports.length === 0
      ? 0
      : Math.round(
          reports.reduce((sum, r) => sum + r.matchScore, 0) / reports.length
        );

  const recentReports = reports.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#030014] text-white">

      {/* ================= NAVBAR ================= */}

      <div className="w-full border-b border-gray-800 bg-[#030014]/80 backdrop-blur">

        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

          <h1 className="text-lg font-bold tracking-wide">
            AI Interview Strategy
          </h1>

          <div className="flex items-center gap-6">

            <button
              onClick={() => navigate("/app")}
              className="text-gray-300 hover:text-white transition"
            >
              Create Plan
            </button>

            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white transition"
            >
              Logout
            </button>

          </div>

        </div>

      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Welcome Section */}

        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back 👋
          </h1>
          <p className="text-gray-400">
            Generate AI-powered interview strategies tailored for your target job.
          </p>
        </div>

        {/* ================= STATS CARDS ================= */}

        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <div className="bg-[#0f0b2d] border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Total Reports</p>
            <h2 className="text-3xl font-bold">{totalReports}</h2>
          </div>

          <div className="bg-[#0f0b2d] border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Average Match Score</p>
            <h2 className="text-3xl font-bold text-pink-400">{avgScore}%</h2>
          </div>

          <div className="bg-[#0f0b2d] border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Plans Generated</p>
            <h2 className="text-3xl font-bold">{totalReports}</h2>
          </div>

        </div>

        {/* ================= CREATE PLAN BUTTON ================= */}

        <button
          onClick={() => navigate("/app")}
          className="mb-12 px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-semibold transition"
        >
          Create Interview Plan
        </button>

        {/* ================= REPORTS SECTION ================= */}

        {reports.length === 0 ? (

          <div className="bg-[#0f0b2d] border border-gray-800 rounded-xl p-10 text-center">

            <h2 className="text-2xl font-semibold mb-3">
              No interview plans yet
            </h2>

            <p className="text-gray-400 mb-6">
              Generate your first AI-powered interview strategy.
            </p>

            <button
              onClick={() => navigate("/app")}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-semibold transition"
            >
              Create First Plan
            </button>

          </div>

        ) : (

          <div className="mb-16">

            <h2 className="text-2xl font-semibold mb-6">
              My Interview Plans
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              {reports.map(report => (
                <div
                  key={report._id}
                  onClick={() => navigate(`/interview/${report._id}`)}
                  className="cursor-pointer bg-[#0f0b2d] border border-gray-800 p-6 rounded-xl hover:border-pink-500 transition"
                >

                  <h3 className="text-lg font-semibold mb-2">
                    {report.title || "Untitled Position"}
                  </h3>

                  <p className="text-gray-400 text-sm mb-3">
                    Generated on {new Date(report.createdAt).toLocaleDateString()}
                  </p>

                  <p className="text-pink-400 font-semibold">
                    Match Score: {report.matchScore}%
                  </p>

                </div>
              ))}

            </div>

          </div>

        )}

        {/* ================= RECENT ACTIVITY ================= */}

        {recentReports.length > 0 && (

          <div>

            <h2 className="text-2xl font-semibold mb-6">
              Recent Activity
            </h2>

            <div className="space-y-4">

              {recentReports.map(report => (

                <div
                  key={report._id}
                  className="flex justify-between items-center bg-[#0f0b2d] border border-gray-800 rounded-lg p-4"
                >

                  <div>

                    <p className="font-medium">
                      Generated strategy for
                    </p>

                    <p className="text-gray-400 text-sm">
                      {report.title || "Untitled Position"}
                    </p>

                  </div>

                  <span className="text-sm text-gray-400">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>

    </div>
  );
}