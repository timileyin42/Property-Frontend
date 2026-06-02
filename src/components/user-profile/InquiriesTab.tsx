import React, { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { formatDate } from "../../util/formatDate";
import type { Inquiry, InquiryListResponse, InquiryStatus } from "../../types/userProfile";

const getStatusStyles = (status: InquiryStatus) => {
  switch (status) {
    case "CONTACTED":
      return "bg-success-emerald/10 border-success-emerald/30 text-success-emerald";
    case "CLOSED":
      return "bg-white/5 border-[rgba(248,246,241,0.15)] text-on-surface-variant";
    case "NEW":
    default:
      return "bg-premium-gold/10 border-premium-gold/30 text-premium-gold";
  }
};

const getStatusLabel = (status: InquiryStatus) => {
  switch (status) {
    case "CONTACTED":
      return "Contacted";
    case "CLOSED":
      return "Closed";
    case "NEW":
    default:
      return "Pending";
  }
};

const InquiriesTab: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await api.get<InquiryListResponse>("/user/interests");
        setInquiries(res.data.inquiries);
      } catch (error) {
        console.error("Failed to fetch inquiries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  return (
    <div className="glass-panel rounded-xl p-6">
      <div>
        <h3 className="font-display text-2xl text-on-surface">My Inquiries</h3>
        <p className="text-on-surface-variant text-sm mt-1">
          Track your property inquiries and responses
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {isLoading ? (
          <p className="text-on-surface-variant text-sm">Loading inquiries...</p>
        ) : inquiries.length === 0 ? (
          <p className="text-on-surface-variant text-sm">No inquiries yet.</p>
        ) : (
          inquiries.map((item) => (
            <div
              key={item.id}
              className="glass-panel border-l-4 border-l-premium-gold rounded-lg overflow-hidden"
            >
              <div className="p-6 flex flex-col gap-3">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h4 className="font-display text-xl text-on-surface">
                      {item.property_title ?? "Property Inquiry"}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span
                      className={`inline-flex items-center justify-center rounded px-2 py-1 label-caps text-[10px] border ${getStatusStyles(
                        item.status
                      )}`}
                    >
                      {getStatusLabel(item.status)}
                    </span>
                    <span className="text-on-surface-variant">{formatDate(item.created_at)}</span>
                  </div>
                </div>

                <div className="bg-surface-low rounded-lg p-4 border border-[rgba(248,246,241,0.1)]">
                  <p className="label-caps text-[10px] text-on-surface-variant mb-1">Your Message</p>
                  <p className="text-on-surface-variant text-sm">{item.message}</p>
                </div>

                {item.assigned_admin_name && (
                  <div className="bg-premium-gold/10 rounded-lg p-4 border-l-4 border-premium-gold">
                    <p className="label-caps text-[10px] text-premium-gold mb-1">Response</p>
                    <p className="text-on-surface-variant text-sm">
                      {`Assigned to ${item.assigned_admin_name}.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InquiriesTab;
