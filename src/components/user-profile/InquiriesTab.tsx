import React, { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { formatDate } from "../../util/formatDate";
import type { Inquiry, InquiryListResponse, InquiryStatus } from "../../types/userProfile";

const locationIcon = "https://www.figma.com/api/mcp/asset/bf227cd5-a182-4b5c-b228-6b0a7a7a3407";

const getStatusStyles = (status: InquiryStatus) => {
  switch (status) {
    case "CONTACTED":
      return "bg-[#dcfce7] border-[#7bf1a8] text-[#008236]";
    case "CLOSED":
      return "bg-[#e5e7eb] border-[#d1d5db] text-[#374151]";
    case "NEW":
    default:
      return "bg-[#fef9c2] border-[#ffdf20] text-[#a65f00]";
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
    <div className="bg-white border border-black/10 rounded-[14px] p-6">
      <div>
        <h3 className="text-[#1e3a8a] text-[20px] font-medium leading-[28px]">
          My Inquiries
        </h3>
        <p className="text-[#717182] text-[16px] leading-[24px] mt-1">
          Track your property inquiries and responses
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {isLoading ? (
          <p className="text-[#6a7282] text-[14px] leading-[20px]">
            Loading inquiries...
          </p>
        ) : inquiries.length === 0 ? (
          <p className="text-[#6a7282] text-[14px] leading-[20px]">
            No inquiries yet.
          </p>
        ) : (
          inquiries.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#1e3a8a] border-l-4 rounded-[14px] overflow-hidden"
            >
              <div className="p-6 flex flex-col gap-3">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h4 className="text-[#1e3a8a] text-[18px] font-semibold leading-[28px]">
                      {item.property_title ?? "Property Inquiry"}
                    </h4>
                    <div className="flex items-center gap-2 text-[#4a5565] text-[14px] leading-[20px]">
                      <img src={locationIcon} alt="" className="h-4 w-4" />
                      <span>Location not available</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[14px] leading-[20px]">
                    <span
                      className={`inline-flex items-center justify-center rounded-[8px] px-[9px] py-[3px] text-[12px] font-medium leading-[16px] border ${getStatusStyles(
                        item.status
                      )}`}
                    >
                      {getStatusLabel(item.status)}
                    </span>
                    <span className="text-[#6a7282]">{formatDate(item.created_at)}</span>
                  </div>
                </div>

                <div className="bg-[#f9fafb] rounded-[10px] p-4">
                  <p className="text-[#364153] text-[14px] font-medium leading-[20px]">
                    Your Message:
                  </p>
                  <p className="text-[#4a5565] text-[14px] leading-[20px]">
                    {item.message}
                  </p>
                </div>

                {item.assigned_admin_name && (
                  <div className="bg-[#eff6ff] rounded-[10px] p-4 border-l-4 border-[#1e3a8a]">
                    <p className="text-[#1e3a8a] text-[14px] font-medium leading-[20px]">
                      Admin Response:
                    </p>
                    <p className="text-[#364153] text-[14px] leading-[20px]">
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
