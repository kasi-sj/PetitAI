// app/set-up/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/utils/store";
import { updateUserSetUp } from "@/actions/user";

export default function InitialSetup() {
  const router = useRouter();
  const userId = useUserStore((state) => state.user?.userId);
  const { user } = useUserStore();

  const handleUserTypeSelect = async (isAdmin: boolean) => {
    if (isAdmin) {
      router.push("/organization-setup");
    } else {
      // Call your normal user function
      await handleNormalUser();
      router.push("/user");
    }
  };

  const handleNormalUser = async () => {
    // Implement normal user logic
    console.log(user);
    await updateUserSetUp(userId || "");
    console.log("Normal user selected");
  };

  return (
    <div className="bg-gray-100 w-full h-screen flex items-center justify-center">
      <div className=" flex items-center  bg-[#2e2e2e]  shadow-xl rounded-lg  p-16 justify-center">
        <div className="text-center space-y-8">
          <h1 className="text-3xl text-white font-bold">
            Which user you are ?
          </h1>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => handleUserTypeSelect(false)}
              className="px-8 py-4 text-lg"
            >
              Normal User
            </Button>
            <Button
              onClick={() => handleUserTypeSelect(true)}
              className="px-8 py-4 text-lg text-[#131313] bg-[#D6cfe1] hover:bg-[#c9b5d6] hover:text-[#2e2e2e]"
            >
              Admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
