import api from './api';

const invoiceService = {
    // Generate invoice
    generateInvoice: async (invoiceData = {}) => {
        try {
            const response = await api.post('/invoices/generate', invoiceData);
            return response;
        } catch (error) {
            console.error('Error generating invoice:', error);
            throw error;
        }
    },

    // Get invoice by ID
    getInvoiceById: async (invoiceId) => {
        try {
            const response = await api.get(`/invoices/${invoiceId}`);
            return response;
        } catch (error) {
            console.error(`Error fetching invoice ${invoiceId}:`, error);
            throw error;
        }
    },

    // Get all invoices
    getInvoices: async (params = {}) => {
        try {
            const response = await api.get('/invoices/list', { params });
            return response;
        } catch (error) {
            console.error('Error fetching invoices:', error);
            throw error;
        }
    },

    // Download invoice PDF
    downloadInvoice: async (invoiceId) => {
        try {
            const response = await api.get(`/invoices/download/${invoiceId}`, {
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            console.error(`Error downloading invoice ${invoiceId}:`, error);
            throw error;
        }
    }
};

export default invoiceService;