export type Department = {
  id: string;
  name: string;
};

export type StaffStatus = "pending" | "approved" | "rejected";

export type Staff = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  referencePhotoUrl: string; // object URL from getUserMedia capture
  status: StaffStatus;
  createdAt: string;
};

export type AttendanceRecord = {
  id: string;
  staffId: string;
  photoUrl: string;
  latitude: number;
  longitude: number;
  distanceFromOfficeMeters: number;
  withinGeofence: boolean;
  address: string; // reverse-geocoded, or fallback coordinate string
  timestamp: string;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
};
