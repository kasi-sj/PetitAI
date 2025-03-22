import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: { userId: string | null; token: string | null };
  setUser: (userId: string, token: string) => void;
  logout: () => void;
}

interface OrganizationUserState {
  user: {
    id: string | null,
    department: {
      id: string | null;
      name: string | null;
    }
    organization: {
      id: string | null;
      name: string | null;
    }
  }
  setUserOrganizationUser: (id: string, department: { id: string, name: string }, organization: { id: string, name: string }) => void;
  logoutOrganizationUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: { userId: null, token: null },
      setUser: (userId, token) => set({ user: { userId, token } }),
      logout: () => {
        set({ user: { userId: null, token: null } });
        window.location.href = "/"; // Redirect to login page on logout
      },
    }),
    {
      name: "user-storage",
    }
  )
);

export const useOrganizationUser = create<OrganizationUserState>()(
  persist(
    (set) => ({
      user: {
        id: null,
        department: {
          id: null,
          name: null
        },
        organization: {
          id: null,
          name: null
        }
      },
      setUserOrganizationUser: (id, department, organization) => set({
        user: {
          id,
          department: {
            id: department.id,
            name: department.name
          },
          organization: {
            id: organization.id,
            name: organization.name
          }
        }
      }),
      logoutOrganizationUser: () => set({
        user: {
          id: null,
          department: { id: null, name: null },
          organization: { id: null, name: null }
        }
      }),
    }),
    {
      name: "organization-user-storage", // Persist key
    }
  )
);