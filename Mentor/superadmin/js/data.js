/* Superadmin Data Store & State Management */

const SuperadminData = {
  kpisTop: [
    { title: "Total Users", value: "24,589", trend: "+12.5%", isUp: true, icon: "fa-users", color: "purple" },
    { title: "Total Services", value: "1,489", trend: "+8.7%", isUp: true, icon: "fa-briefcase", color: "blue" },
    { title: "Active Providers", value: "8,354", trend: "+10.3%", isUp: true, icon: "fa-user-nurse", color: "green" },
    { title: "Total Bookings", value: "12,843", trend: "+15.8%", isUp: true, icon: "fa-calendar-check", color: "orange" },
    { title: "Total Revenue", value: "₹18,75,430", trend: "+18.9%", isUp: true, icon: "fa-wallet", color: "pink" },
    { title: "Total Reviews", value: "6,247", trend: "+11.2%", isUp: true, icon: "fa-star", color: "purple" }
  ],

  recentActivities: [
    { type: "user", icon: "fa-user-plus", bg: "rgba(16,185,129,0.15)", color: "#10b981", title: "New user registered", subtitle: "John Deo (john@example.com)", time: "2 min ago" },
    { type: "booking", icon: "fa-calendar-plus", bg: "rgba(59,130,246,0.15)", color: "#3b82f6", title: "New booking received", subtitle: "Plumbing Service (#BK-12569)", time: "8 min ago" },
    { type: "provider", icon: "fa-user-nurse", bg: "rgba(249,115,22,0.15)", color: "#f97316", title: "New provider joined", subtitle: "Ravi Kumar (Provider ID: PR-4587)", time: "15 min ago" },
    { type: "review", icon: "fa-star", bg: "rgba(139,92,246,0.15)", color: "#8b5cf6", title: "New review received", subtitle: "by Anjali Sharma (5★ for Cleaning Service)", time: "28 min ago" },
    { type: "coupon", icon: "fa-ticket", bg: "rgba(236,72,153,0.15)", color: "#ec4899", title: "New coupon created", subtitle: "FLAT20 (20% off on all services)", time: "45 min ago" },
    { type: "payout", icon: "fa-money-bill-transfer", bg: "rgba(6,182,212,0.15)", color: "#06b6d4", title: "Payout completed", subtitle: "Ravi Kumar (₹4,250)", time: "1 hour ago" }
  ],

  topServices: [
    { name: "Home Cleaning", bookings: "2,543 Bookings", percentage: 85, icon: "fa-broom", color: "#8b5cf6" },
    { name: "Plumbing", bookings: "1,987 Bookings", percentage: 70, icon: "fa-faucet", color: "#f97316" },
    { name: "Electrical Work", bookings: "1,685 Bookings", percentage: 60, icon: "fa-bolt", color: "#f59e0b" },
    { name: "Painting", bookings: "1,256 Bookings", percentage: 48, icon: "fa-paint-roller", color: "#ec4899" },
    { name: "Carpentry", bookings: "1,034 Bookings", percentage: 40, icon: "fa-hammer", color: "#3b82f6" }
  ],

  systemOverview: [
    { name: "Website Status", icon: "fa-globe", status: "Operational" },
    { name: "Server Status", icon: "fa-server", status: "Operational" },
    { name: "Database", icon: "fa-database", status: "Operational" },
    { name: "Storage", icon: "fa-hard-drive", status: "Operational" },
    { name: "Email Service", icon: "fa-envelope", status: "Operational" },
    { name: "Payment Gateway", icon: "fa-credit-card", status: "Operational" }
  ],

  kpisBottom: [
    { title: "Total Enquiries", value: "3,456", trend: "+9.4%", isUp: true, icon: "fa-comments", color: "purple" },
    { title: "Active Coupons", value: "28", trend: "+6.1%", isUp: true, icon: "fa-tags", color: "pink" },
    { title: "Total Blog Posts", value: "156", trend: "+7.8%", isUp: true, icon: "fa-newspaper", color: "amber" },
    { title: "Total Pages", value: "42", trend: "+5.2%", isUp: true, icon: "fa-file-lines", color: "blue" },
    { title: "Support Tickets", value: "87", trend: "-3.6%", isUp: false, icon: "fa-headset", color: "cyan" }
  ]
};
