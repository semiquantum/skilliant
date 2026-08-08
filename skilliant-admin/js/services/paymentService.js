/**
 * Skilliant Admin Portal — Payment & Financial Service Abstraction
 * Centralized financial calculations (commission, net payout, escrow tracking)
 * and payment lifecycle management.
 *
 * BACKEND INTEGRATION NOTE:
 * When connecting a real payment gateway (Razorpay / Stripe):
 * Replace development adapters with real backend API endpoints.
 * DO NOT expose gateway secret keys on the frontend.
 */

const PaymentService = {
    // Centralized Commission Calculation
    getCommissionRate() {
        const settings = DataService.getSettings();
        return parseFloat(settings.commissionPercentage) || 10;
    },

    calculateCommission(amount, customRate = null) {
        const rate = customRate !== null ? customRate : this.getCommissionRate();
        const numericAmount = parseFloat(amount) || 0;
        return parseFloat(((numericAmount * rate) / 100).toFixed(2));
    },

    calculateNetAmount(amount, commissionFee = null) {
        const numericAmount = parseFloat(amount) || 0;
        const fee = commissionFee !== null ? parseFloat(commissionFee) : this.calculateCommission(numericAmount);
        return parseFloat((numericAmount - fee).toFixed(2));
    },

    // Process a refund (Updates Payment, Booking, and Wallet atomically)
    refundPayment(paymentId) {
        const payments = DataService.getCollection(DataService.KEYS.PAYMENTS);
        const p = payments.find(x => x.id === paymentId);
        if (!p) return { success: false, message: 'Transaction not found.' };

        if (p.status === 'Refunded') {
            return { success: false, message: 'Transaction is already refunded.' };
        }

        // Update payment status
        p.status = 'Refunded';
        p.refundStatus = 'Full Refund';
        p.refundAmount = p.amount;
        DataService.setStorage(DataService.KEYS.PAYMENTS, payments);

        // Update associated booking
        const bookings = DataService.getCollection(DataService.KEYS.BOOKINGS);
        const b = bookings.find(x => x.id === p.bookingId);
        if (b) {
            b.status = 'Cancelled';
            b.escrowStatus = 'Refunded';
            DataService.setStorage(DataService.KEYS.BOOKINGS, bookings);
        }

        // Update Wallet escrow balance
        const wallet = DataService.getStorage(DataService.KEYS.WALLET);
        if (wallet) {
            wallet.escrowBalance = Math.max(0, (wallet.escrowBalance || 0) - (p.amount || 0));
            DataService.setStorage(DataService.KEYS.WALLET, wallet);
        }

        DataService.logActivity(`Refunded payment ${paymentId} for booking ${p.bookingId || 'N/A'}`);
        return { success: true, message: `Payment ${paymentId} refunded successfully.` };
    },

    // Process payout disbursement
    approvePayout(requestId) {
        const wallet = DataService.getStorage(DataService.KEYS.WALLET);
        if (!wallet || !wallet.payoutRequests) return { success: false, message: 'Wallet data not found.' };

        const req = wallet.payoutRequests.find(x => x.requestId === requestId);
        if (!req) return { success: false, message: 'Payout request not found.' };

        if (req.status === 'Approved') {
            return { success: false, message: 'Payout is already approved.' };
        }

        req.status = 'Approved';
        req.approvedAt = new Date().toISOString();

        const payoutVal = parseFloat(String(req.amount).replace(/[^0-9.]/g, '')) || 0;
        wallet.pendingPayouts = Math.max(0, (wallet.pendingPayouts || 0) - payoutVal);
        wallet.totalProcessed = (wallet.totalProcessed || 0) + payoutVal;

        DataService.setStorage(DataService.KEYS.WALLET, wallet);
        DataService.logActivity(`Approved earnings payout ${requestId} of ${req.amount} to ${req.recipient}`);
        return { success: true, message: `Payout ${requestId} approved & disbursed.` };
    }
};
