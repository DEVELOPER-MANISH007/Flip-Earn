import React, { useState } from "react";
import { X } from "lucide-react";

const WithdrawModal = ({ onClose }) => {
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState([
    { type: "text", name: "Account Holder Name", value: "" },
    { type: "text", name: "Bank Name", value: "" },
    { type: "text", name: "Account Number", value: "" },
    { type: "text", name: "Account Type", value: "" },
    { type: "text", name: "SWIFT", value: "" },
    { type: "text", name: "Branch", value: "" },
  ]);

  const handleSubmission = async (e) => {
    e.preventDefault();
    // TODO: hook this up to your API / withdrawal logic
  };

  return (
    <div className="fixed inset-0 z-120 flex items-start md:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pt-24 md:pt-4 pb-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] md:max-h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-indigo-500 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-lg truncate">Withdraw Funds</h1>
            <p className="text-xs text-indigo-100 mt-0.5">
              Enter your bank details to request a withdrawal.
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
          {/* Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-[2fr,3fr] items-center gap-2">
            <label className="text-sm font-medium text-gray-800">
              Amount
            </label>
            <input
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              type="number"
              min="0"
              placeholder="Enter amount"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Bank details */}
          {account.map((field, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-[2fr,3fr] items-center gap-2"
            >
              <label className="text-sm font-medium text-gray-800">
                {field.name}
              </label>
              <input
                type={field.type}
                value={field.value}
                placeholder={field.name}
                onChange={(e) =>
                  setAccount((prev) =>
                    prev.map((c, i) =>
                      i === index ? { ...c, value: e.target.value } : c
                    )
                  )
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}

          {/* Submit button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              Apply for Withdrawal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawModal;
