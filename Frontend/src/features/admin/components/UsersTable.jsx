import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Trash2, 
  ShieldAlert, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight,
  User,
  Mail,
  Calendar,
  ShieldHalf
} from "lucide-react";
import { getUsers, deleteUser, toggleBanUser } from "../services/admin.api";

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const USERS_PER_PAGE = 5;

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.log("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Terminate user record? This action is permanent.")) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  const handleBan = async (id) => {
    await toggleBanUser(id);
    fetchUsers();
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (page - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  return (
    <div className="w-full">
      {/* --- SEARCH HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" size={16} />
          <input
            placeholder="Search credentials..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 w-full md:w-80 transition-all"
          />
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">
          Showing {paginatedUsers.length} of {filteredUsers.length} Entries
        </div>
      </div>

      {/* --- TABLE AREA --- */}
      <div className="overflow-x-auto rounded-2xl border border-white/5 bg-white/[0.01]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Identity</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Access Level</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Registered</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {paginatedUsers.map((user, idx) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-pink-500/20 flex items-center justify-center border border-white/10">
                        <User size={18} className="text-gray-300" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors uppercase tracking-tight">
                          {user.username}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                          <Mail size={12} /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md border uppercase tracking-tighter ${
                      user.role === 'admin' 
                      ? 'bg-pink-500/10 text-pink-500 border-pink-500/20' 
                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.isBanned ? 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />
                      <span className={`text-xs font-bold ${user.isBanned ? 'text-red-400' : 'text-emerald-400'}`}>
                        {user.isBanned ? 'RESTRICTED' : 'OPTIMAL'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-600" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.role !== "admin" && (
                        <>
                          {/* <button
                            onClick={() => handleBan(user._id)}
                            className={`p-2 rounded-lg border transition-all ${
                              user.isBanned 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20' 
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20'
                            }`}
                            title={user.isBanned ? "Lift Restriction" : "Restrict User"}
                          >
                            {user.isBanned ? <UserCheck size={16} /> : <ShieldAlert size={16} />}
                          </button> */}
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all mr-2"
                            title="Delete Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-xl text-xs font-black transition-all border ${
                page === p 
                ? 'bg-pink-500 border-pink-500 text-white shadow-[0_0_15px_rgba(219,39,119,0.4)]' 
                : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:bg-white/10'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default UsersTable;