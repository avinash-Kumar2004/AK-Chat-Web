import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  return (
    <>
      <header
        className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40
        backdrop-blur-lg bg-base-100/80"
      >
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            {/* Left Logo */}
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="flex items-center gap-2.5 hover:opacity-80 transition-all"
              >
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-lg font-bold">AK-Chat</h1>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Link to="/setting" className="btn btn-sm gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>

              {authUser && (
                <>
                  <Link to="/profile" className="btn btn-sm gap-2">
                    <User className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>

                  <button
                    className="btn btn-sm gap-2 text-error hover:bg-error/10"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    <LogOut className="size-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Logout</h3>
            <p className="py-4">
              Are you sure you want to logout?
            </p>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-error"
                onClick={handleLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default Navbar;
