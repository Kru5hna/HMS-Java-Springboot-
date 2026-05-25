// Initial mock data for CareSync Hospital Management System

export const initialPatients = [
  {
    id: 1,
    name: "John Doe",
    age: 45,
    gender: "Male",
    bloodGroup: "O+",
    contact: "+1 555-0199",
    status: "Admitted",
    department: "Cardiology",
    bedId: "ICU-01",
    doctorName: "Dr. Sarah Jenkins",
    checkInDate: "2026-05-18",
    vitals: { bp: "135/85", pulse: 82, temp: "98.6°F", spo2: 97 },
    diagnosis: "Coronary artery disease, post-angioplasty recovery monitoring.",
    prescriptions: ["Aspirin 81mg QD", "Atorvastatin 40mg HS", "Metoprolol 25mg BID"]
  },
  {
    id: 2,
    name: "Lily Smith",
    age: 8,
    gender: "Female",
    bloodGroup: "A-",
    contact: "+1 555-0143",
    status: "Admitted",
    department: "Pediatrics",
    bedId: "PED-02",
    doctorName: "Dr. Robert Chen",
    checkInDate: "2026-05-19",
    vitals: { bp: "102/68", pulse: 96, temp: "101.4°F", spo2: 99 },
    diagnosis: "Acute bronchitis with high-grade fever. Hydration management.",
    prescriptions: ["Amoxicillin 250mg TID", "Acetaminophen 160mg q4h PRN"]
  },
  {
    id: 3,
    name: "David Vance",
    age: 62,
    gender: "Male",
    bloodGroup: "B+",
    contact: "+1 555-0182",
    status: "Admitted",
    department: "Neurology",
    bedId: "ICU-03",
    doctorName: "Dr. Elena Rostova",
    checkInDate: "2026-05-15",
    vitals: { bp: "142/90", pulse: 68, temp: "98.2°F", spo2: 95 },
    diagnosis: "Transient ischemic attack (TIA) monitoring.",
    prescriptions: ["Clopidogrel 75mg QD", "Lisinopril 10mg QD"]
  },
  {
    id: 4,
    name: "Emily Brown",
    age: 29,
    gender: "Female",
    bloodGroup: "AB+",
    contact: "+1 555-0155",
    status: "Outpatient",
    department: "General Medicine",
    bedId: "None",
    doctorName: "Dr. Maria Santos",
    checkInDate: "2026-05-20",
    vitals: { bp: "118/75", pulse: 72, temp: "98.4°F", spo2: 99 },
    diagnosis: "Allergy testing and mild seasonal asthma checkup.",
    prescriptions: ["Montelukast 10mg HS", "Fluticasone nasal spray QD"]
  },
  {
    id: 5,
    name: "Marcus Stone",
    age: 38,
    gender: "Male",
    bloodGroup: "O-",
    contact: "+1 555-0177",
    status: "Discharged",
    department: "Orthopedics",
    bedId: "None",
    doctorName: "Dr. James Carter",
    checkInDate: "2026-05-10",
    vitals: { bp: "120/80", pulse: 75, temp: "98.6°F", spo2: 99 },
    diagnosis: "Fractured distal radius checkup.",
    prescriptions: ["Ibuprofen 400mg q6h PRN"]
  }
];

export const initialDoctors = [
  { id: 1, name: "Dr. Sarah Jenkins", spec: "Cardiology", status: "Available", patientsCount: 12, exp: "14 Years", contact: "+1 555-0101", email: "sarah.j@caresync.com" },
  { id: 2, name: "Dr. Robert Chen", spec: "Pediatrics", status: "In Surgery", patientsCount: 8, exp: "10 Years", contact: "+1 555-0102", email: "robert.c@caresync.com" },
  { id: 3, name: "Dr. Elena Rostova", spec: "Neurology", status: "Available", patientsCount: 5, exp: "18 Years", contact: "+1 555-0103", email: "elena.r@caresync.com" },
  { id: 4, name: "Dr. James Carter", spec: "Orthopedics", status: "Off-Duty", patientsCount: 9, exp: "8 Years", contact: "+1 555-0104", email: "james.c@caresync.com" },
  { id: 5, name: "Dr. Maria Santos", spec: "General Medicine", status: "Available", patientsCount: 15, exp: "6 Years", contact: "+1 555-0105", email: "maria.s@caresync.com" }
];

export const initialBeds = [
  { id: "ICU-01", number: "101", ward: "ICU", status: "Occupied", occupiedById: 1 },
  { id: "ICU-02", number: "102", ward: "ICU", status: "Available", occupiedById: null },
  { id: "ICU-03", number: "103", ward: "ICU", status: "Occupied", occupiedById: 3 },
  { id: "ICU-04", number: "104", ward: "ICU", status: "Cleaning", occupiedById: null },
  { id: "PED-01", number: "201", ward: "Pediatric Ward", status: "Available", occupiedById: null },
  { id: "PED-02", number: "202", ward: "Pediatric Ward", status: "Occupied", occupiedById: 2 },
  { id: "PED-03", number: "203", ward: "Pediatric Ward", status: "Available", occupiedById: null },
  { id: "GW-01", number: "301", ward: "General Ward", status: "Available", occupiedById: null },
  { id: "GW-02", number: "302", ward: "General Ward", status: "Available", occupiedById: null },
  { id: "GW-03", number: "303", ward: "General Ward", status: "Available", occupiedById: null },
  { id: "ER-01", number: "E-1", ward: "Emergency Room", status: "Available", occupiedById: null },
  { id: "ER-02", number: "E-2", ward: "Emergency Room", status: "Cleaning", occupiedById: null }
];

export const initialAppointments = [
  { id: 1, patientName: "John Doe", doctorName: "Dr. Sarah Jenkins", date: "2026-05-20", time: "10:30 AM", status: "Confirmed", reason: "Post-angioplasty follow-up" },
  { id: 2, patientName: "Lily Smith", doctorName: "Dr. Robert Chen", date: "2026-05-20", time: "02:15 PM", status: "Confirmed", reason: "Bronchitis recovery review" },
  { id: 3, patientName: "Emily Brown", doctorName: "Dr. Maria Santos", date: "2026-05-21", time: "09:00 AM", status: "Pending", reason: "Allergy panel and asthma check" },
  { id: 4, patientName: "David Vance", doctorName: "Dr. Elena Rostova", date: "2026-05-22", time: "11:30 AM", status: "Pending", reason: "Chronic migraine management evaluation" }
];

export const initialActivities = [
  { id: 1, text: "Patient John Doe checked into ICU Bed 101.", time: "2 hours ago", type: "checkin" },
  { id: 2, text: "Dr. Robert Chen entered surgery for pediatric patient.", time: "3 hours ago", type: "doctor" },
  { id: 3, text: "ICU Bed 104 set to cleaning status.", time: "4 hours ago", type: "bed" },
  { id: 4, text: "Appointment scheduled for Emily Brown with Dr. Maria Santos.", time: "5 hours ago", type: "appointment" }
];
