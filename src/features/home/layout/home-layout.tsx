export const dynamic = "force-dynamic";
export const revalidate = 0;
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import HomeNavbar from "../components/home-navbar";
import { getMe } from "@/lib/services/frontend/auth.service";
import HomeSidebar from "../components/home-sidebar";

// export async function getMeServer(): Promise<User | null> {
//   try {
//     const {
//       data: { data },
//     } = await axios.get("http://localhost:3000/api/auth/me");

//     return data.user;
//   } catch (error) {
//     console.log(error);
//     throw (
//       (error &&
//         typeof error === "object" &&
//         "response" in error &&
//         error.response !== null &&
//         typeof error.response === "object" &&
//         "data" in error.response &&
//         error.response?.data) || {
//         error: "Network Error",
//       }
//     );
//     console.log("Server-side auth failed, will try client-side");
//     // return null;
//   }
// }

const HomeLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getMe();
  return (
    <div className="font-lory">
      <SidebarProvider>
        <div className="w-full grid md:grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
          <HomeNavbar user={user} />
          {/* <HomeNavbar /> */}
          <HomeSidebar />
          <main className="w-full">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default HomeLayout;
