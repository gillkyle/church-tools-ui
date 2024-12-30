import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { api } from "../lib/api";

export function Directory() {
  const {
    data: directory,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["directory"],
    queryFn: () => api.getDirectory(),
  });
  console.log(directory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        Failed to load directory
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Ward Directory</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {directory?.map((household) => (
          <div key={household.uuid} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg">{household.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{household.address}</p>

            {household.members.length > 1 && (
              <div className="mt-3">
                <p className="text-sm font-medium">Household Members:</p>
                <ul className="text-sm text-gray-600 mt-1">
                  {household.members.map((member) => (
                    <li key={member.uuid}>{member.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
