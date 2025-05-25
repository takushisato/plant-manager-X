export type AttendanceByUserIdResponse = {
  data: {
    id: number;
    name: string;
    attendance_count: number;
    detail: string | undefined;
  }[];
};

export type UserAttendanceList = {
  id: number;
  name: string;
  attendance_count: number;
  detail: string | undefined;
};

export type NewAttendance = {
  user_id: number;
  date: string;
  start_time: string;
  end_time: string;
};

export type AttendanceStore = {
  currentDate: Date;
  currentYearMonth: string;
  postAttendance: (attendance: NewAttendance) => Promise<void>;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  allUserAttendanceList: AllUserAttendanceList[];
  getUserAttendanceList: () => Promise<void>;
  overtimeHours: number;
  getAttendanceByUserId: () => Promise<void>;
};

export type AllUserAttendanceList = {
  id: number;
  name: string;
  attendance_count: number;
  detail: string | undefined;
};

export type AttendanceListResponse = {
  user: {
    id: number;
    name: string;
  };
  total_worked_date: number;
  detail: string | undefined;
};

export type UpdateAttendance = {
  id: number;
  start_time: string;
  end_time: string;
};

export type AttendanceData = {
  date: string;
  start_time: string | null;
  end_time: string | null;
};
