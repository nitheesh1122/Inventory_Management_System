import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import {
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Typography,
  Select,
  Box,
  InputAdornment,
  Container,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Chip,
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from "@mui/material";

// Simple icon components instead of using mui-icons
const IconComponent = ({ children }) => (
  <span style={{ 
    display: 'inline-flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    marginRight: '8px',
    color: '#1976d2'
  }}>
    {children}
  </span>
);

const Billing = () => {
  // States
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerPoints, setCustomerPoints] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [customerSearchResults, setCustomerSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [customerLookupLoading, setCustomerLookupLoading] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [discountFromPoints, setDiscountFromPoints] = useState(0);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, salesRes] = await Promise.all([
          axios.get("http://localhost:5009/api/inventory"),
          axios.get("http://localhost:5009/api/billing")
        ]);
        setProducts(productsRes.data);
        setSales(salesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbar({
          open: true,
          message: "Failed to load data. Please try again.",
          severity: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle product selection
  const handleProductChange = (event) => {
    const productId = event.target.value;
    const product = products.find((prod) => prod._id === productId);
    setSelectedProduct(productId);
    setQuantity(1);
    calculateTotal(productId, 1, pointsToRedeem);
    
    // Clear error when field is filled
    if (productId) {
      setErrors({ ...errors, selectedProduct: null });
    }
  };

  // Handle quantity change
  const handleQuantityChange = (event) => {
    const newQuantity = Math.max(1, parseInt(event.target.value) || 0);
    setQuantity(newQuantity);
    calculateTotal(selectedProduct, newQuantity, pointsToRedeem);
    
    // Clear error when valid quantity is entered
    if (newQuantity > 0) {
      setErrors({ ...errors, quantity: null });
    }
  };

  // Calculate total with any points discount
  const calculateTotal = (productId, qty, points) => {
    const product = products.find((prod) => prod._id === productId);
    if (product) {
      const subtotal = product.price * qty;
      // Calculate discount (1 point = Rs 0.1 discount)
      const discount = Math.min(points * 0.1, subtotal * 0.2); // Max 20% discount
      setDiscountFromPoints(discount);
      setTotal(subtotal - discount);
    } else {
      setDiscountFromPoints(0);
      setTotal(0);
    }
  };

  // Handle customer name change
  const handleCustomerNameChange = (event) => {
    setCustomerName(event.target.value);
    
    // Clear error when field is filled
    if (event.target.value) {
      setErrors({ ...errors, customerName: null });
    }
  };

  // Handle customer phone change
  const handleCustomerPhoneChange = (event) => {
    setCustomerPhone(event.target.value);
    
    // Clear error when field is filled
    if (event.target.value) {
      setErrors({ ...errors, customerPhone: null });
    }
  };

  // Handle points redemption change
  const handlePointsRedemptionChange = (event) => {
    const points = Math.min(parseInt(event.target.value) || 0, customerPoints);
    setPointsToRedeem(points);
    calculateTotal(selectedProduct, quantity, points);
  };

  // Handle customer lookup
  const lookupCustomer = async () => {
    if (!customerPhone || customerPhone.length < 10) {
      setErrors({
        ...errors,
        customerPhone: "Please enter a valid phone number"
      });
      return;
    }

    try {
      setCustomerLookupLoading(true);
      // Mock API call - in a real scenario, this would be an actual endpoint
      // const response = await axios.get(`http://localhost:5009/api/customers/lookup/${customerPhone}`);
      
      // Simulating response for demo purposes
      // In a real scenario, you would use the actual API response
      setTimeout(() => {
        const customerExists = Math.random() > 0.5;
        
        if (customerExists) {
          // Customer found
          const mockCustomer = {
            name: "John Doe", // This would come from your API
            phone: customerPhone,
            points: Math.floor(Math.random() * 500) // Mock points
          };
          
          setCustomerName(mockCustomer.name);
          setCustomerPoints(mockCustomer.points);
          setSnackbar({
            open: true,
            message: `Customer found! Available points: ${mockCustomer.points}`,
            severity: "success"
          });
        } else {
          // Customer not found
          setCustomerDialogOpen(true);
          setNewCustomer({ name: "", phone: customerPhone });
        }
        setCustomerLookupLoading(false);
      }, 800);
      
    } catch (error) {
      console.error("Error looking up customer:", error);
      setSnackbar({
        open: true,
        message: "Failed to lookup customer. Please try again.",
        severity: "error"
      });
      setCustomerLookupLoading(false);
    }
  };

  // Create new customer
  const createNewCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      return;
    }

    try {
      // Mock API call - in a real scenario, this would be an actual endpoint
      // const response = await axios.post("http://localhost:5009/api/customers", newCustomer);
      
      // Simulating successful creation
      setCustomerName(newCustomer.name);
      setCustomerPhone(newCustomer.phone);
      setCustomerPoints(0);
      
      setSnackbar({
        open: true,
        message: "New customer created successfully!",
        severity: "success"
      });
      
      setCustomerDialogOpen(false);
    } catch (error) {
      console.error("Error creating customer:", error);
      setSnackbar({
        open: true,
        message: "Failed to create customer. Please try again.",
        severity: "error"
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedProduct) {
      newErrors.selectedProduct = "Please select a product";
    }
    
    if (!quantity || quantity <= 0) {
      newErrors.quantity = "Please enter a valid quantity";
    }
    
    if (!customerName.trim()) {
      newErrors.customerName = "Please enter customer name";
    }
    
    if (!customerPhone.trim()) {
      newErrors.customerPhone = "Please enter customer phone";
    } else if (customerPhone.length < 10) {
      newErrors.customerPhone = "Phone number must be at least 10 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle sale submission
  const handleSaleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const product = products.find((prod) => prod._id === selectedProduct);
    
    const newSale = {
      productName: product.name,
      productId: selectedProduct,
      quantity,
      price: product.price,
      totalAmount: total,
      customerName,
      customerPhone,
      paymentMethod,
      date: new Date().toISOString(),
      pointsEarned: Math.floor(total / 10), // 1 point for every Rs 10
      pointsRedeemed: pointsToRedeem
    };

    try {
      setSubmitting(true);
      
      // Add sale
      // In a real application, you would update these endpoints to match your backend
      // const response = await axios.post("http://localhost:5009/api/billing", newSale);
      
      // Update inventory quantity after sale
      // await axios.put(`http://localhost:5009/api/inventory/${selectedProduct}/reduce`, {
      //   quantityChange: -quantity,
      // });
      
      // Update customer points in database (add earned points, subtract redeemed)
      // await axios.put(`http://localhost:5009/api/customers/${customerPhone}/points`, {
      //   pointsChange: newSale.pointsEarned - pointsToRedeem
      // });
      
      // For demo purposes - simulating successful submission
      setTimeout(() => {
        // Update sales with mock response
        const mockResponse = {
          data: {
            sale: {
              ...newSale,
              _id: Date.now().toString(), // Mock ID
            }
          }
        };
        
        setSales([mockResponse.data.sale, ...sales]);
        
        // Update local products state to reflect inventory change
        const updatedProducts = products.map(prod => 
          prod._id === selectedProduct 
            ? { ...prod, quantity: prod.quantity - quantity }
            : prod
        );
        setProducts(updatedProducts);
        
        // Show success message
        setSnackbar({
          open: true,
          message: `Sale recorded successfully! Customer earned ${newSale.pointsEarned} points.`,
          severity: "success"
        });
        
        resetForm();
        setSubmitting(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error recording sale:", error);
      setSnackbar({
        open: true,
        message: "Failed to record sale. Please try again.",
        severity: "error"
      });
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedProduct("");
    setQuantity(1);
    setTotal(0);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerPoints(0);
    setPointsToRedeem(0);
    setDiscountFromPoints(0);
    setPaymentMethod("cash");
    setErrors({});
  };

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("Sales Report", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Add table
    const tableColumn = ["Product", "Customer", "Quantity", "Price (₹)", "Total (₹)", "Payment", "Date"];
    const tableRows = sales.map((sale) => [
      sale.productName,
      `${sale.customerName} (${sale.customerPhone || 'N/A'})`,
      sale.quantity,
      sale.price ? sale.price.toFixed(2) : '0.00',
      sale.totalAmount ? sale.totalAmount.toFixed(2) : '0.00',
      sale.paymentMethod || 'Cash',
      new Date(sale.date || Date.now()).toLocaleDateString()
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [25, 118, 210] }
    });
    
    // Add summary
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`Total Revenue: ₹${totalRevenue.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);
    
    doc.save("sales_report.pdf");
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'linear-gradient(to right, #1976d2, #2196f3)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconComponent>🛒</IconComponent>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              Billing Dashboard
            </Typography>
          </Box>
          <Chip 
            label={`${sales.length} Transactions`} 
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.9)', 
              color: '#1976d2',
              fontWeight: 500
            }} 
          />
        </Box>
        
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            borderBottom: '1px solid #e0e0e0',
            '& .MuiTab-root': { fontWeight: 500 }
          }}
        >
          <Tab label="New Transaction" icon={<IconComponent>📝</IconComponent>} />
          <Tab label="Sales History" icon={<IconComponent>📊</IconComponent>} />
        </Tabs>
        
        {/* New Transaction Tab */}
        <Box hidden={activeTab !== 0}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Customer Section */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    <IconComponent>👤</IconComponent> Customer Information
                  </Typography>
                  <Grid container spacing={2} alignItems="flex-end">
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Phone Number"
                        fullWidth
                        value={customerPhone}
                        onChange={handleCustomerPhoneChange}
                        error={!!errors.customerPhone}
                        helperText={errors.customerPhone}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">📱</InputAdornment>,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button 
                                onClick={lookupCustomer}
                                disabled={customerLookupLoading}
                                sx={{ whiteSpace: 'nowrap' }}
                              >
                                {customerLookupLoading ? (
                                  <CircularProgress size={24} />
                                ) : (
                                  "Lookup"
                                )}
                              </Button>
                            </InputAdornment>
                          )
                        }}
                        placeholder="Enter phone number"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Customer Name"
                        fullWidth
                        value={customerName}
                        onChange={handleCustomerNameChange}
                        error={!!errors.customerName}
                        helperText={errors.customerName}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">👤</InputAdornment>
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 1, 
                        bgcolor: customerPoints > 0 ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                        borderRadius: 1
                      }}>
                        <Box>
                          <Typography variant="body2" color="textSecondary">Loyalty Points</Typography>
                          <Typography variant="h6" color={customerPoints > 0 ? 'success.main' : 'text.secondary'} sx={{ fontWeight: 600 }}>
                            {customerPoints || 0} points
                          </Typography>
                        </Box>
                        {customerPoints > 0 && (
                          <TextField
                            label="Redeem"
                            size="small"
                            type="number"
                            sx={{ ml: 2, width: '120px' }}
                            value={pointsToRedeem}
                            onChange={handlePointsRedemptionChange}
                            InputProps={{
                              inputProps: { min: 0, max: customerPoints }
                            }}
                          />
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              
              {/* Product Selection & Quantity */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" error={!!errors.selectedProduct}>
                  <InputLabel>Select Product</InputLabel>
                  <Select
                    value={selectedProduct}
                    onChange={handleProductChange}
                    displayEmpty
                    renderValue={(selected) => (
                      selected ? products.find(p => p._id === selected)?.name || "Select a product" : "Select a product"
                    )}
                    startAdornment={<InputAdornment position="start">🛍️</InputAdornment>}
                    error={!!errors.selectedProduct}
                  >
                    {products.map((product) => (
                      <MenuItem 
                        key={product._id} 
                        value={product._id}
                        disabled={product.quantity <= 0}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <Typography>{product.name}</Typography>
                          <Box>
                            <Typography component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                              ₹{product.price?.toFixed(2) || "0.00"}
                            </Typography>
                            <Typography component="span" sx={{ 
                              ml: 2, 
                              color: product.quantity > 5 ? 'success.main' : 'warning.main',
                              fontSize: '0.85rem'
                            }}>
                              ({product.quantity || 0} in stock)
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.selectedProduct && (
                    <FormHelperText error>{errors.selectedProduct}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" error={!!errors.quantity}>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">🔢</InputAdornment>,
                      inputProps: { min: 1 }
                    }}
                    error={!!errors.quantity}
                    helperText={errors.quantity}
                  />
                </FormControl>
              </Grid>

              {/* Payment Method */}
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" margin="normal">
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Payment Method</Typography>
                  <RadioGroup
                    row
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel value="cash" control={<Radio />} label="Cash" />
                    <FormControlLabel value="card" control={<Radio />} label="Card" />
                    <FormControlLabel value="upi" control={<Radio />} label="UPI" />
                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Total Section */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mt: 2, p: 3, bgcolor: '#f9fafb' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Selected Product:
                      </Typography>
                      <Typography variant="h6">
                        {selectedProduct ? products.find(p => p._id === selectedProduct)?.name || "None" : "None"}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'flex-end',
                        textAlign: 'right'
                      }}>
                        {discountFromPoints > 0 && (
                          <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
                            Points Discount: -₹{discountFromPoints.toFixed(2)}
                          </Typography>
                        )}
                        <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          ₹{total.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Points to be earned: {Math.floor(total / 10)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              
              {/* Submit Buttons */}
              <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={resetForm}
                  startIcon={<span>🔄</span>}
                  disabled={submitting}
                >
                  Reset
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSaleSubmit}
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : <span>💾</span>}
                  sx={{ px: 4 }}
                >
                  {submitting ? "Processing..." : "Complete Sale"}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Box>
        
        {/* Sales History Tab */}
        <Box hidden={activeTab !== 1}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <IconComponent>📊</IconComponent> Transaction History
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<span>📄</span>}
                onClick={generatePDF}
              >
                Generate Report
              </Button>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : sales.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="center">Quantity</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Price (₹)</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Total (₹)</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Payment</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale._id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                        <TableCell>{sale.productName}</TableCell>
                        <TableCell>
                          {sale.customerName}
                          <Typography variant="caption" display="block" color="textSecondary">
                            {sale.customerPhone}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{sale.quantity}</TableCell>
                        <TableCell align="right">₹{sale.price?.toFixed(2) || "0.00"}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 500 }}>
                          ₹{sale.totalAmount?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            size="small" 
                            label={sale.paymentMethod || "Cash"} 
                            sx={{ 
                              bgcolor: sale.paymentMethod === 'cash' ? '#e3f2fd' : 
                                      sale.paymentMethod === 'card' ? '#e8f5e9' : 
                                      sale.paymentMethod === 'upi' ? '#fff3e0' : '#f3e5f5'
                            }} 
                          />
                        </TableCell>
                        <TableCell>{formatDate(sale.date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                <Typography variant="body1" color="textSecondary">
                  No sales records found.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Box>
      </Card>
      
      {/* Customer Dialog */}
      <Dialog open={customerDialogOpen} onClose={() => setCustomerDialogOpen(false)}>
        <DialogTitle>Create New Customer</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            No customer found with this phone number. Create a new customer?
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            value={newCustomer.phone}
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomerDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={createNewCustomer}
            variant="contained"
            disabled={!newCustomer.name}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Billing;