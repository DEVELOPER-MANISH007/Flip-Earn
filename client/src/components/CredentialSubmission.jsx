import { CirclePlus, X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const CredentialSubmission = ({ onClose, listing }) => {
  const [newField, setNewField] = useState("");
  const [credentials, setCredentials] = useState([
    { type: "email", name: "Email", value: "" },
    { type: "password", name: "Password", value: "" },
  ]);

  const handleAddField = () => {
    const name = newField.trim();
    if (!name) {
      toast.error("Please enter a field name");
      return;
    }
    setCredentials((prev) => [...prev, { type: "text", name, value: "" }]);
    setNewField("");
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    // TODO: hook up API submission
  };

  return (
    <div className="fixed inset-0 z-120 flex items-start md:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pt-24 md:pt-4 pb-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] md:max-h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-indigo-500 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-indigo-100 uppercase tracking-wide">
              Credential Submission
            </p>
            <h3 className="font-semibold text-lg truncate">{listing?.title}</h3>
            <p className="text-sm text-indigo-100 truncate">
              @{listing?.username}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-white/15 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmission}
          className="flex-1 px-5 py-4 space-y-4 overflow-y-auto"
        >
          {credentials.map((cred, index) => (
            <div
              key={`${cred.name}-${index}`}
              className="grid grid-cols-1 sm:grid-cols-[2fr,3fr,auto] items-center gap-2"
            >
              <label className="text-sm font-medium text-gray-800">
                {cred.name}
              </label>
              <input
                type={cred.type}
                value={cred.value}
                placeholder={cred.name}
                onChange={(e) =>
                  setCredentials((prev) =>
                    prev.map((c, i) =>
                      i === index ? { ...c, value: e.target.value } : c
                    )
                  )
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() =>
                  setCredentials((prev) => prev.filter((_, i) => i !== index))
                }
                className="text-gray-500 hover:text-red-500 transition-colors flex items-center justify-center"
                aria-label={`Remove ${cred.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add field */}
          <div className="grid grid-cols-1 sm:grid-cols-[2fr,3fr,auto] items-center gap-2 pt-2 border-t border-gray-100">
            <label className="text-sm font-medium text-gray-800">
              New Field
            </label>
            <input
              type="text"
              value={newField}
              onChange={(e) => setNewField(e.target.value)}
              placeholder="e.g. Recovery Email"
              className="w-full px-3 py-2 text-sm border border-dashed border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddField}
              className="inline-flex items-center justify-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <CirclePlus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              Submit Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CredentialSubmission;
