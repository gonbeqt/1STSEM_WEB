import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { X, Plus, Edit, Trash2, User, Building, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { useAddressBook } from '../../../../../../presentation/hooks/useAddressBook';
import { AddressBookEntry } from '../../../../../../domain/entities/AddressBookEntities';

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvestModal = observer(({ isOpen, onClose }: InvestModalProps) => {
  // Use MVVM pattern
  const viewModel = useAddressBook();
  const {
    entries,
    isLoading,
    error,
    successMessage,
    searchTerm,
    isAddingEntry,
    editingEntry,
    formData,
    filteredEntries
  } = viewModel;

  // Load address book on modal open
  useEffect(() => {
    if (isOpen) {
      viewModel.loadAddressBook();
      viewModel.setSearchTerm(''); // Clear search term when modal opens
    }
  }, [isOpen]);

  // Clear messages when modal closes
  useEffect(() => {
    if (!isOpen) {
      viewModel.clearMessages();
      viewModel.setIsAddingEntry(false);
      viewModel.setEditingEntry(null);
    }
  }, [isOpen]);

  const handleAddEntry = async () => {
    await viewModel.addEntry();
  };

  const handleUpdateEntry = async () => {
    await viewModel.updateEntry();
  };

  const handleDeleteEntry = async (address: string) => {
    if (window.confirm('Are you sure you want to delete this address book entry?')) {
      await viewModel.deleteEntry(address);
    }
  };

  const handleStartEdit = (entry: AddressBookEntry) => {
    viewModel.startEdit(entry);
  };

  const handleCancelEdit = () => {
    viewModel.cancelEdit();
  };

  const handleStartAdd = () => {
    viewModel.setIsAddingEntry(true);
    viewModel.setSearchTerm(''); // Clear search term to show all entries
  };

  const handleCancelAdd = () => {
    viewModel.setIsAddingEntry(false);
    viewModel.clearForm();
  };

  const handleFormChange = (field: string, value: string) => {
    viewModel.updateFormData(field as any, value);
  };

  const handleSearchChange = (value: string) => {
    viewModel.setSearchTerm(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Address Book Management</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
              {/* Search and Add Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search address book..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleStartAdd}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Entry
                </button>
              </div>

              {/* Messages */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700">{error}</span>
                  <button
                    onClick={() => viewModel.clearError()}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {successMessage && (
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700">{successMessage}</span>
                  <button
                    onClick={() => viewModel.clearSuccessMessage()}
                    className="ml-auto text-green-500 hover:text-green-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Add/Edit Form */}
              {(isAddingEntry || editingEntry) && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {editingEntry ? 'Edit Entry' : 'Add New Entry'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wallet Address
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleFormChange('address', e.target.value)}
                        placeholder="0x..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck="false"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => handleFormChange('role', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="investor">Investor</option>
                        <option value="partner">Partner</option>
                        <option value="vendor">Vendor</option>
                        <option value="employee">Employee</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <input
                        type="text"
                        value={formData.notes}
                        onChange={(e) => handleFormChange('notes', e.target.value)}
                        placeholder="Additional notes..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={editingEntry ? handleUpdateEntry : handleAddEntry}
                      disabled={isLoading}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                      {editingEntry ? 'Update Entry' : 'Add Entry'}
                    </button>
                    <button
                      onClick={editingEntry ? handleCancelEdit : handleCancelAdd}
                      className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Address Book List */}
              <div className="space-y-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : filteredEntries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No address book entries found</p>
                  </div>
                ) : (
                  filteredEntries.map((entry) => (
                    <div
                      key={entry.address}
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Building className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{entry.name}</h4>
                            <p className="text-sm text-gray-500">{entry.role}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 font-mono">{entry.address}</p>
                        {entry.notes && (
                          <p className="text-sm text-gray-500 mt-1">{entry.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStartEdit(entry)}
                          className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.address)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
});

export default InvestModal;