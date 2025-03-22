import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Select from "react-select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import {
  getOrganizationUserByDepartment,
} from "@/actions/organizationUser";
import { useDebounce } from "@/hooks/use-debounce";
import { petitionStatusUpdate } from "@/actions/statusUpdate";
import { SingleValue } from "react-select";
import SpinningProgress from "../spinning-progress";

type StatusEnum =
  | "ERROR"
  | "SUBMITTED"
  | "QUEUED"
  | "CATEGORIZING"
  | "CATEGORY_ASSIGNED"
  | "ASSIGNED"
  | "DELEGATED"
  | "FORWARDED"
  | "PROCESSING"
  | "REPEATED_REJECTION"
  | "REJECTED"
  | "PROCESSED";

const description: Record<StatusEnum, string> = {
  FORWARDED: "Your petition has been forwarded to the relevant department",
  REJECTED: "Your petition has been rejected.",
  PROCESSED: "Your petition has been processed succesfully.",
  DELEGATED: "Your petition has been delegated to another user.",
  ERROR: "",
  SUBMITTED: "",
  QUEUED: "",
  CATEGORIZING: "",
  CATEGORY_ASSIGNED: "",
  ASSIGNED: "",
  PROCESSING: "",
  REPEATED_REJECTION: "",
};


export default function DelegateModal({
  modalSize = "lg",
  departmentId,
  petitionId,
  refetch, // Pass organizationName as a prop
}: {
  modalSize?: "sm" | "lg";
  departmentId: string;
  petitionId: string;
  refetch: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const [isFirst] = useState(true);
  const [delegatedUser, setDelegatedUser] = useState<string>("");

  // Fetch organization users dynamically
  const { data, isLoading } = useQuery({
    queryKey: ["organization-department-users", departmentId, debouncedSearch],
    queryFn: () =>
      getOrganizationUserByDepartment(departmentId, debouncedSearch),
    enabled: !!(isFirst || debouncedSearch), // Fetch only when search is entered
  });

  const mutation = useMutation({
    mutationFn: async (status: StatusEnum) => {
      await petitionStatusUpdate(
        petitionId,
        status,
        description[status],
        delegatedUser
      );
    },
    onSuccess: () => {
      refetch();
    },
  });

  const statusUpdate = async (status: StatusEnum) => {
    await mutation.mutateAsync(status);
  };

  const deptUsers = data?.users?.data;

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-yellow-600 hover:bg-yellow-700 text-white p-[6px] rounded-lg transition-colors"
      >
        {mutation.isPending ? "Delegating" : "Delegate"}{" "}
        {mutation.isPending && <SpinningProgress size={8} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center overflow-y-scroll bg-slate-900/20 p-8 backdrop-blur"
          >
            <motion.div
              initial={{ scale: 0, rotate: "180deg" }}
              animate={{
                scale: 1,
                rotate: "0deg",
                transition: {
                  type: "spring",
                  bounce: 0.25,
                },
              }}
              exit={{ scale: 0, rotate: "180deg" }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "relative w-full max-w-lg cursor-default overflow-hidden rounded-xl bg-white p-6 text-black shadow-2xl",
                {
                  "max-w-sm": modalSize === "sm",
                }
              )}
            >
              <div className="flex flex-col gap-3">
                <h3
                  className={cn("text-center text-3xl font-bold", {
                    "text-2xl": modalSize === "sm",
                  })}
                >
                  Select the User
                </h3>

                {/* Select Dropdown for Organization Users */}
                <Select
                  placeholder="Select a user"
                  classNames={{
                    control: () =>
                      "min-h-[30px] text-[14px] border border-gray-300 rounded-md",
                    dropdownIndicator: () => "p-[4px]",
                    clearIndicator: () => "p-[4px]",
                    multiValue: () => "bg-gray-300 px-2 py-0.5 rounded",
                    valueContainer: () => "px-[6px] text-[14px] text-black",
                    input: () => "m-0 p-0 text-[14px] text-black",
                    option: () => "text-[14px] text-black",
                  }}
                  onChange={(selectedOption: SingleValue<{ value: string }>) =>
                    setDelegatedUser(selectedOption ? selectedOption.value : "")
                  }
                  onInputChange={setSearch}
                  isLoading={isLoading}
                  options={deptUsers?.map(
                    (user: { name: string; id: string }) => ({
                      label: user.name,
                      value: user.id,
                    })
                  )}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded py-2 font-semibold text-white bg-black transition-colors hover:bg-gray-800"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      statusUpdate("DELEGATED");
                      setIsOpen(false);
                    }}
                    className="w-full rounded bg-white border-black border-2 py-2 font-semibold text-black transition-opacity hover:bg-gray-600 hover:text-white hover:border-transparent"
                  >
                    Delegate
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
