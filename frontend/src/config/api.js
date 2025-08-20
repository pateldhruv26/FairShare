// API Configuration
// TODO: Replace this with your actual backend URL when deployed
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.onrender.com';

export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNIN: `${API_BASE_URL}/api/auth/signin`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  GOOGLE_AUTH: `${API_BASE_URL}/api/auth/google`,
  
  // Transaction endpoints
  GET_TRANSACTIONS: (userId) => `${API_BASE_URL}/api/transactions/getTransactions/${userId}`,
  ADD_TRANSACTION: `${API_BASE_URL}/api/transactions/addTransaction`,
  EDIT_TRANSACTION: (id) => `${API_BASE_URL}/api/transactions/editTransaction/${id}`,
  DELETE_TRANSACTION: (id) => `${API_BASE_URL}/api/transactions/deleteTransaction/${id}`,
  GET_TRANSACTIONS_BY_FILTER: `${API_BASE_URL}/api/transactions/getTransactionsByFilter`,
  GET_TOTAL_STATS: (userId) => `${API_BASE_URL}/api/transactions/getTotalStats/${userId}`,
  GET_WEEKLY_TRANSACTION: (userId) => `${API_BASE_URL}/api/transactions/getWeeklyTransaction/${userId}`,
  GET_MONTHLY_TRANSACTION: (userId) => `${API_BASE_URL}/api/transactions/getMonthlyTransaction/${userId}`,
  GET_YEARLY_TRANSACTION: (userId) => `${API_BASE_URL}/api/transactions/getYearlyTransaction/${userId}`,
  GET_CATEGORY_WISE_TRANSACTION: (userId) => `${API_BASE_URL}/api/transactions/getCategoryWiseTransaction/${userId}`,
  
  // Bills endpoints
  ADD_BILL: `${API_BASE_URL}/api/bills/addBill`,
  GET_BILLS: (userId) => `${API_BASE_URL}/api/bills/getBills/${userId}`,
  EDIT_BILL: (id) => `${API_BASE_URL}/api/bills/editBill/${id}`,
  DELETE_BILL: (id) => `${API_BASE_URL}/api/bills/deleteBill/${id}`,
  
  // Savings endpoints
  ADD_SAVING: `${API_BASE_URL}/api/savings/addSaving`,
  GET_SAVINGS: (userId) => `${API_BASE_URL}/api/savings/getSavings/${userId}`,
  EDIT_SAVING: (id) => `${API_BASE_URL}/api/savings/editSaving/${id}`,
  DELETE_SAVING: (id) => `${API_BASE_URL}/api/savings/deleteSaving/${id}`,
  
  // Group endpoints
  CREATE_GROUP: `${API_BASE_URL}/api/group/creategroup`,
  JOIN_GROUP: `${API_BASE_URL}/api/group/joingroup`,
  GET_GROUPS: (userId) => `${API_BASE_URL}/api/group/getgroups/${userId}`,
  GET_GROUP: (id) => `${API_BASE_URL}/api/group/getgroup/${id}`,
  DELETE_GROUP: (id) => `${API_BASE_URL}/api/group/deleteGroup/${id}`,
  ADD_FRIENDS_GROUP: (id) => `${API_BASE_URL}/api/group/addfriendsgroup/${id}`,
  SPLIT_BILL: `${API_BASE_URL}/api/group/splitbill`,
  GET_MEMBERS: (id) => `${API_BASE_URL}/api/group/getmembers/${id}`,
  MARK_APPROVED: (id) => `${API_BASE_URL}/api/group/markapproved/${id}`,
  SIMPLIFY_DEBT: (id) => `${API_BASE_URL}/api/group/simplifyDebt/${id}`,
  GET_DEBTS: (id) => `${API_BASE_URL}/api/group/getDebts/${id}`,
  ADD_COMMENT: `${API_BASE_URL}/api/group/addcomment`,
  GET_COMMENTS: (id) => `${API_BASE_URL}/api/group/getcomments/${id}`,
  APPROVE_DEBT: (id) => `${API_BASE_URL}/api/group/approveDebt/${id}`,
  
  // User endpoints
  GET_BADGES: (userId) => `${API_BASE_URL}/api/user/getBadges/${userId}`,
  ADD_BADGE: (userId) => `${API_BASE_URL}/api/user/addbadge/${userId}`,
  GET_URLS: (userId) => `${API_BASE_URL}/api/user/getUrls/${userId}`,
  ADD_STOCK: (userId) => `${API_BASE_URL}/api/user/addStock/${userId}`,
  DELETE_STOCK: (userId) => `${API_BASE_URL}/api/user/deletestock/${userId}`,
  GET_STOCKS: (userId) => `${API_BASE_URL}/api/user/getStocks/${userId}`,
  
  // Friend endpoints
  SEND_REQUEST: (userId) => `${API_BASE_URL}/api/friend/sendRequest/${userId}`,
  ACCEPT_REQUEST: (userId) => `${API_BASE_URL}/api/friend/acceptRequest/${userId}`,
  
  // Mail endpoints
  SEND_MAIL: `${API_BASE_URL}/api/mail/sendmail`,
  SEND_START_MAIL: `${API_BASE_URL}/api/mail/sendstartmail`,
  SEND_MAIL_RECURRING: `${API_BASE_URL}/api/mail/sendmailrecurring`,
};

export default API_BASE_URL;
