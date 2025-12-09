import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Euro, Download, Check, Clock, AlertCircle, Search, Filter } from 'lucide-react';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Status configurations
  const statusConfig = {
    draft: {
      label: 'Draft',
      color: 'bg-gray-100 text-gray-800',
      icon: AlertCircle,
      translation: 'Ciornă'
    },
    sent: {
      label: 'Sent',
      color: 'bg-blue-100 text-blue-800',
      icon: Clock,
      translation: 'Trimisă'
    },
    paid: {
      label: 'Paid',
      color: 'bg-green-100 text-green-800',
      icon: Check,
      translation: 'Plătită'
    },
    overdue: {
      label: 'Overdue',
      color: 'bg-red-100 text-red-800',
      icon: AlertCircle,
      translation: 'Restantă'
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-gray-100 text-gray-800',
      icon: AlertCircle,
      translation: 'Anulată'
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch('/api/client/invoices', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setInvoices(data.data || []);
      } else {
        setError(data.message || 'Eroare la încărcarea facturilor');
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Eroare de conexiune. Vă rugăm încercați din nou.');
    } finally {
      setLoading(false);
    }
  };

  // Filter invoices based on search and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' ||
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.project_name && invoice.project_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format amount
  const formatAmount = (amount, currency) => {
    return `${amount.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} ${currency}`;
  };

  const handleDownload = async (invoiceId, invoiceNumber) => {
    try {
      const token = localStorage.getItem('token');

      // For now, show an alert that PDF download would happen here
      // In a real implementation, this would download a PDF file
      alert(`Descărcare PDF pentru factura ${invoiceNumber} (funcționalitate de implementat)`);

      // Future implementation:
      // const response = await fetch(`/api/client/invoices/${invoiceId}/download`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });

      // if (response.ok) {
      //   const blob = await response.blob();
      //   const url = window.URL.createObjectURL(blob);
      //   const a = document.createElement('a');
      //   a.href = url;
      //   a.download = `${invoiceNumber}.pdf`;
      //   document.body.appendChild(a);
      //   a.click();
      //   window.URL.revokeObjectURL(url);
      //   document.body.removeChild(a);
      // }
    } catch (err) {
      console.error('Error downloading invoice:', err);
      setError('Eroare la descărcarea facturii');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Se încarcă facturile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Facturile Mele</h1>
              <p className="mt-2 text-gray-600">
                Gestionează și descarcă facturile pentru proiectele tale
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">
                {invoices.length} facturi
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Caută după număr factură sau proiect..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Toate statusurile</option>
                <option value="draft">Ciornă</option>
                <option value="sent">Trimisă</option>
                <option value="paid">Plătită</option>
                <option value="overdue">Restantă</option>
                <option value="cancelled">Anulată</option>
              </select>
            </div>
          </div>
        </div>

        {/* Invoices List */}
        {filteredInvoices.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {invoices.length === 0 ? 'Nu aveți facturi încă' : 'Nu s-au găsit facturi'}
            </h3>
            <p className="text-gray-600">
              {invoices.length === 0
                ? 'Facturile vor apărea aici odată ce proiectele vor facturate.'
                : 'Încercați să ajustați criteriile de căutare sau filtrul.'
              }
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Număr Factură
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proiect
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Suma
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Scadentă
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => {
                    const StatusIcon = statusConfig[invoice.status]?.icon || AlertCircle;
                    const statusColor = statusConfig[invoice.status]?.color || 'bg-gray-100 text-gray-800';
                    const statusTranslation = statusConfig[invoice.status]?.translation || invoice.status;

                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {invoice.invoice_number}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">
                            {invoice.project_name || 'Fără proiect'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Euro className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm font-medium text-gray-900">
                              {formatAmount(invoice.amount, invoice.currency)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusTranslation}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            {formatDate(invoice.due_date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDownload(invoice.id, invoice.invoice_number)}
                            className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                            title="Descarcă PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              {filteredInvoices.map((invoice) => {
                const StatusIcon = statusConfig[invoice.status]?.icon || AlertCircle;
                const statusColor = statusConfig[invoice.status]?.color || 'bg-gray-100 text-gray-800';
                const statusTranslation = statusConfig[invoice.status]?.translation || invoice.status;

                return (
                  <div key={invoice.id} className="p-4 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">
                          {invoice.invoice_number}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusTranslation}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      {invoice.project_name && (
                        <div>
                          <span className="text-gray-500">Proiect:</span>
                          <span className="ml-2 text-gray-900">{invoice.project_name}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Euro className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="font-medium text-gray-900">
                            {formatAmount(invoice.amount, invoice.currency)}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDownload(invoice.id, invoice.invoice_number)}
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Descarcă
                        </button>
                      </div>

                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Scadent: {formatDate(invoice.due_date)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {invoices.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total Facturi</p>
                  <p className="text-lg font-semibold text-gray-900">{invoices.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Plătite</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {invoices.filter(inv => inv.status === 'paid').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">În Așteptare</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {invoices.filter(inv => inv.status === 'sent').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Euro className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total Neplătit</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatAmount(
                      invoices
                        .filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled')
                        .reduce((sum, inv) => sum + inv.amount, 0),
                      'EUR'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesPage;