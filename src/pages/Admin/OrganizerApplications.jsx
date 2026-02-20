import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaEye,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import {
  fetchOrganizerApplications,
} from "../../store/admin/adminAuthThunks";

const StatusBadge = ({ status }) => {
  const cfg = {
    pending: {
      cls: "bg-amber-500/15 text-amber-400 border-amber-500/20",
      icon: FaClock,
      label: "Pending",
    },
    approved: {
      cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
      icon: FaCheckCircle,
      label: "Approved",
    },
    rejected: {
      cls: "bg-red-500/15 text-red-400 border-red-500/20",
      icon: FaTimesCircle,
      label: "Rejected",
    },
  }[status];

  const Icon = cfg?.icon || FaClock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
        cfg?.cls || "bg-[#1E1E1E] text-[#9ca6ba] border-[#282e39]"
      }`}
    >
      <Icon className="text-[10px]" /> {cfg?.label || status}
    </span>
  );
};

function OrganizerApplications() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search = "" } = useOutletContext() || {};

  const [filter, setFilter] = useState("All");

  const { applications, listLoading } = useSelector(
    (state) => state.adminAuth
  );

  useEffect(() => {
    const status = filter === "All" ? null : filter.toLowerCase();
    dispatch(fetchOrganizerApplications(status));
  }, [dispatch, filter]);

  const filteredApplications = applications?.filter((app) => {
    const keyword = search.toLowerCase();
    return (
      app.organization_name?.toLowerCase().includes(keyword) ||
      app.contact_name?.toLowerCase().includes(keyword) ||
      app.contact_email?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-white text-2xl font-black">
          Organizer Applications
        </h2>
        <p className="text-[#505a6b] text-sm mt-1">
          {filteredApplications?.length || 0} applications found
        </p>
      </div>

      {listLoading && (
        <div className="text-center text-[#9ca6ba] py-6">
          Loading applications...
        </div>
      )}

      {!listLoading && (
        <div className="bg-[#0C1017] border border-[#1a2030] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a2030]">
                <th className="px-6 py-3 text-left text-xs text-[#505a6b]">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs text-[#505a6b]">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs text-[#505a6b]">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs text-[#505a6b]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications?.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-[#1a2030]/50 hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-4 text-white">
                    {app.organization_name}
                  </td>
                  <td className="px-6 py-4 text-[#9ca6ba]">
                    {app.contact_name}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        navigate(`/admin/organizer-applications/${app.id}`)
                      }
                      className="p-1.5 rounded bg-[#1a2030] border border-[#283039] text-[#9ca6ba] hover:text-white"
                    >
                      <FaEye className="text-xs" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrganizerApplications;
