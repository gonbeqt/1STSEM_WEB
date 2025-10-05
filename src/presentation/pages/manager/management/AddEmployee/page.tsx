import React, { useState } from 'react';
import { container } from '../../../../../di/container';
import { useEmployeeViewModel } from '../../../../../domain/viewmodel/EmployeeViewModel';
import { AddEmployeeRequest, AddEmployeeResponse } from '../../../../../domain/repositories/EmployeeRepository';
import { ArrowLeft } from 'lucide-react';

interface AddEmployeeData {
  email: string;
  position: string;
  department: string;
  full_name: string;
  phone: string;
}

interface AddEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: AddEmployeeResponse['employee']) => void;
}

const AddEmployee: React.FC<AddEmployeeProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { 
    addEmployee, 
    isLoading, 
    error, 
    success, 
    clearMessages 
  } = useEmployeeViewModel(
    container.addEmployeeUseCase, 
    container.getEmployeesByManagerUseCase,
    container.removeEmployeeFromTeamUseCase
  );

  const [formData, setFormData] = useState<AddEmployeeData>({
    email: '',
    position: '',
    department: 'Finance',
    full_name: '',
    phone: ''
  });

  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Employee email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    clearMessages();

    if (!validateForm()) {
      return;
    }

    try {
      const request: AddEmployeeRequest = {
        email: formData.email,
        position: formData.position || undefined,
        department: formData.department || undefined,
        full_name: formData.full_name || undefined,
        phone: formData.phone || undefined
      };

      const response = await addEmployee(request);

      if (response.success && response.employee) {
        setFormData({
          email: '',
          position: '',
          department: 'Finance',
          full_name: '',
          phone: ''
        });
        setValidationErrors({});
        
        onSubmit(response.employee);
        onClose();
        
        alert(`Employee ${response.employee.full_name || response.employee.username} has been added to your team successfully!`);
      } else {
        console.error('Failed to add employee to team:', response.message);
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      position: '',
      department: 'Finance',
      full_name: '',
      phone: ''
    });
    setValidationErrors({});
    clearMessages();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]">
        <div className="bg-white rounded-xl w-[90%] max-w-[500px] max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center p-6 pb-4 border-b border-gray-200 relative">
            <button 
              className="bg-transparent border-none text-2xl text-gray-500 p-0 mr-4 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100  transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={handleClose}
              disabled={isLoading}
            >
              <ArrowLeft/>
            </button>
            <h2 className="text-lg font-semibold text-gray-900 m-0">Add Employee to Team</h2>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[400px] overflow-y-auto">
            <div className="flex flex-col gap-5">
              {/* Email Field */}
              <div className="flex flex-col gap-1.5 text-black bg-white">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Employee Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 border border-gray-300 rounded-lg text-sm text-black bg-white transition-all focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed ${validationErrors.email ? 'border-red-600' : ''}`}
                  placeholder="Enter existing employee's email"
                  disabled={isLoading}
                />
                {validationErrors.email && (
                  <span className="text-red-600 text-xs mt-1">{validationErrors.email}</span>
                )}
              </div>

              {/* Full Name Field */}
              <div className="flex flex-col gap-1.5 text-black bg-white">
                <label htmlFor="full_name" className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-black bg-white transition-all focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  placeholder="Optional: Update employee's full name"
                  disabled={isLoading}
                />
              </div>

              {/* Position Field */}
              <div className="flex flex-col gap-1.5 text-black bg-white">
                <label htmlFor="position" className="text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-black bg-white transition-all focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  placeholder="Optional: Specify position"
                  disabled={isLoading}
                />
              </div>

              {/* Department Field */}
              <div className="flex flex-col gap-1.5 text-black bg-white">
                <label htmlFor="department" className="text-sm font-medium text-gray-700">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-black bg-white transition-all focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276,9 12,15 18,9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_12px_center] bg-[length:16px] pr-10 appearance-none cursor-pointer"
                  disabled={isLoading}
                >
                  <option value="">Select Department</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="Sales">Sales</option>
                  <option value="Customer Service">Customer Service</option>
                </select>
              </div>

              {/* Phone Field */}
              <div className="flex flex-col gap-1.5 text-black bg-white">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-black bg-white transition-all focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  placeholder="Optional: Add phone number"
                  disabled={isLoading}
                />
              </div>

              {/* Info Box */}
              <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700 border-l-4 border-purple-500 mt-4">
                <strong>Note:</strong> This will add an existing employee to your team. 
                The employee must already be registered in the system.
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-4 pt-4 border-t border-gray-200 bg-gray-50">
            <button 
              className="bg-white text-gray-500 border border-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              className={`bg-purple-500 text-white border-none px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed relative min-w-[100px] ${isLoading ? 'after:content-[\'\'] after:absolute after:w-4 after:h-4 after:border-2 after:border-t-white after:border-transparent after:rounded-full after:animate-spin after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2' : ''}`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add to Team'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="fixed top-5 right-5 p-3 rounded-md bg-red-100 border border-red-200 text-red-800 max-w-[400px] flex items-center justify-between z-[10000]">
          <strong>Error:</strong> {error}
          <button onClick={clearMessages} className="bg-transparent border-none text-red-800 font-bold ml-2.5 text-base cursor-pointer">
            ×
          </button>
        </div>
      )}

      {/* Success Display */}
      {success && (
        <div className="fixed top-5 right-5 p-3 rounded-md bg-green-100 border border-green-200 text-green-800 max-w-[400px] flex items-center justify-between z-[10000]">
          <strong>Success:</strong> {success}
          <button onClick={clearMessages} className="bg-transparent border-none text-green-800 font-bold ml-2.5 text-base cursor-pointer">
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default AddEmployee;