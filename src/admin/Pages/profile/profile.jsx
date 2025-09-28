import React from "react";
import { BadgeCheck, XCircle, User } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useProfile } from "../../controller/Profile/profileCTR";
import { FaPencilAlt } from "react-icons/fa";

export default function ProfileCard() {
  const {
    profile,
    loading,
    editing,
    setEditing,
    formData,
    handleInputChange,
    handleImageChange,
    handleSave,
    handleCancel,
    saving,
    selectedImage,
    API_URL,
  } = useProfile();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-600">
        <Loader2 className="animate-spin w-8 h-8 mb-2" />
        <span>Loading Profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <p className="text-center text-red-500 font-medium mt-6">
        Failed to load profile
      </p>
    );
  }

  return (
    <div className="flex justify-center mt-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative w-16 h-16">
            {!editing ? (
              profile.img_url ? (
                <img
                  src={`${API_URL}/assets/admin/${profile.img_url}`}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-gray-500" />
              )
            ) : (
              <div className="relative w-16 h-16">
                {selectedImage ? (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : profile.img_url ? (
                  <img
                    src={`${API_URL}/assets/admin/${profile.img_url}`}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-4 border-gray-600 opacity-50"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-500" />
                )}

                {/* Hidden file input overlaid on image */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full cursor-pointer rounded-full opacity-0"
                  title="Click to change image"
                />

                {/* Plus icon overlay */}
                <div className="absolute bottom-0 right-0 bg-blue-600 bg-opacity-85 text-white rounded-full p-2 shadow-md w-6 h-6 flex justify-center items-center">
                  <span className="text-xs font-bold m-2"><FaPencilAlt className="text-xs" /></span>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1">
            {!editing ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {profile.name || "Admin"}
                </h2>
                <p className="text-sm text-gray-500">
                  {profile.roles || "Admin Role"}
                </p>
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 w-full mb-2 bg-white"
                  placeholder="Name"
                />
                <input
                  type="text"
                  name="roles"
                  value={formData.roles}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 w-full bg-white"
                  placeholder="Role"
                />
              </>
            )}
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* Profile Details */}
        <div className="space-y-4 text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">ID:</span>
            <span className="text-gray-600">{profile._id || "N/A"}</span>
          </div>

          {!editing ? (
            <div className="flex justify-between">
              <span className="font-medium">Mobile:</span>
              <span className="text-gray-600">{profile.mobile || "N/A"}</span>
            </div>
          ) : (
            <div>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="border rounded px-2 py-1 w-full bg-white"
                placeholder="Mobile Number"
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="font-medium">Verified:</span>
            {profile.is_verified ? (
              <span className="flex items-center text-green-600 font-semibold">
                <BadgeCheck className="w-5 h-5 mr-1" /> Yes
              </span>
            ) : (
              <span className="flex items-center text-red-600 font-semibold">
                <XCircle className="w-5 h-5 mr-1" /> No
              </span>
            )}
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Last Login:</span>
            <span className="text-gray-600">
              {profile.lastLogin
                ? new Date(profile.lastLogin).toLocaleString()
                : "N/A"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Created At:</span>
            <span className="text-gray-600">
              {profile.created_at
                ? new Date(profile.created_at).toLocaleString()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Footer / Action Buttons */}
        <div className="mt-6 text-center">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-green-700 transition-colors"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-full hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}