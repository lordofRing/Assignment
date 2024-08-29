"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const [locations, setLocations] = useState<{ Id: number; Name: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    Id: 0,
    FirstName: "",
    LastName: "",
    Location: "",
  });

  const [employees, setEmployees] = useState([]);

  const fetchLocation = async () => {
    try {
      const response = await fetch('/api/location');
      console.log(response);
      const data = await response.json();
      console.log(data);
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await fetch('/api/').then((res) => res.json());
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchEmployeeById = async (id: number) => {
    try {
      const response = await fetch(`/api?id=${id}`);
      if (!response.ok) {
        throw new Error(`Error fetching employee: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched employee:', data);
      setEmployees(data); 
    } catch (error) {
      console.error('Error fetching employee:', error);
    }
  };
  
  useEffect(() => {
    fetchLocation();
    fetchEmployees();
  }, []);

  const handleAddClick = () => {
    setIsEditing(false);
    setFormData({ Id: 0, FirstName: "", LastName: "", Location: "" });
    setIsModalOpen(true);
    fetchLocation();
  };

  const handleEditClick = (employee: any) => {
    fetchEmployeeById(employee.Id);
    setIsEditing(true);
    setFormData(employee);
    setIsModalOpen(true);
    fetchLocation();
  };

  const handleSave = async () => {
    if (isEditing) {
      await fetch(`/api/`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
    } else {
      await fetch("/api/", {
        method: "POST",
        body: JSON.stringify(formData),
      });
    }
    setIsModalOpen(false);
    fetchEmployees();
  };

  return (
    <>
      <div className="bg-white">
        <button
          onClick={handleAddClick}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Employee
        </button>

        <table className="min-w-full divide-y divide-gray-200 overflow-x-auto mt-4">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees?.map((employee: any) => (
              <tr key={employee.Id}>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {employee.FirstName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {employee.LastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {employee.Location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a
                    onClick={() => handleEditClick(employee)}
                    className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                  >
                    Edit
                  </a>
             
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {isEditing ? "Edit Employee" : "Add Employee"}
                      </h3>
                      <div className="mt-2 text-black">
                        <input
                          type="text"
                          placeholder="First Name"
                          value={formData.FirstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              FirstName: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm"
                        />
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={formData.LastName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              LastName: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                       <select
                          value={formData.Location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              Location: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border text-black  border-gray-300 rounded-md shadow-sm text-black"
                        >
                          <option value="">Select Location</option>
                          {locations.map((location) => (
                            <option key={location.Id} value={location.Name}>
                              {location.Name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={handleSave}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isEditing ? "Update" : "Save"}
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
