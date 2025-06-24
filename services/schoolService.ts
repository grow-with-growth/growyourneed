// School Management Service - Comprehensive SaaS School Management System
// This service handles all school-related operations for the admin dashboard

export interface School {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  principalName: string;
  establishedYear: number;
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  academicYear: string;
  status: 'active' | 'inactive' | 'suspended';
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise';
    startDate: string;
    endDate: string;
    status: 'active' | 'expired' | 'trial';
  };
  settings: {
    timezone: string;
    currency: string;
    language: string;
    dateFormat: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  schoolId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  parentId: string;
  classId: string;
  grade: string;
  section: string;
  admissionDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  profilePicture?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
  };
  academicRecord: {
    gpa: number;
    attendance: number;
    behaviorScore: number;
    achievements: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  schoolId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  subjects: string[];
  classes: string[];
  qualifications: string[];
  experience: number;
  joinDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'on-leave';
  profilePicture?: string;
  performance: {
    rating: number;
    studentFeedback: number;
    parentFeedback: number;
    achievements: string[];
  };
  schedule: {
    [day: string]: {
      periods: {
        time: string;
        subject: string;
        class: string;
      }[];
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Parent {
  id: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  occupation?: string;
  relationship: 'father' | 'mother' | 'guardian';
  studentIds: string[];
  emergencyContact: boolean;
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    phone: boolean;
  };
  paymentInfo: {
    method: 'card' | 'bank' | 'cash';
    cardLast4?: string;
    bankAccount?: string;
  };
  meetings: {
    id: string;
    date: string;
    time: string;
    teacherId: string;
    subject: string;
    status: 'scheduled' | 'completed' | 'cancelled';
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface FinanceRecord {
  id: string;
  schoolId: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  paymentMethod?: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed';
  createdBy: string;
  createdAt: string;
}

export interface MarketingCampaign {
  id: string;
  schoolId: string;
  name: string;
  type: 'email' | 'social' | 'print' | 'digital';
  status: 'draft' | 'active' | 'paused' | 'completed';
  targetAudience: 'parents' | 'students' | 'community' | 'all';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  metrics: {
    reach: number;
    engagement: number;
    conversions: number;
    leads: number;
  };
  content: {
    title: string;
    description: string;
    imageUrl?: string;
    callToAction: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Mock Data
export const mockSchools: School[] = [
  {
    id: 'school-1',
    name: 'Greenwood Elementary School',
    address: '123 Education St, Learning City, LC 12345',
    phone: '+1-555-0123',
    email: 'admin@greenwood.edu',
    website: 'https://greenwood.edu',
    logo: 'https://picsum.photos/seed/school1/100/100',
    principalName: 'Dr. Sarah Johnson',
    establishedYear: 1985,
    totalStudents: 450,
    totalTeachers: 32,
    totalStaff: 15,
    academicYear: '2024-2025',
    status: 'active',
    subscription: {
      plan: 'premium',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active'
    },
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      language: 'en',
      dateFormat: 'MM/DD/YYYY'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-23T00:00:00Z'
  },
  {
    id: 'school-2',
    name: 'Riverside High School',
    address: '456 Knowledge Ave, Study Town, ST 67890',
    phone: '+1-555-0456',
    email: 'contact@riverside.edu',
    website: 'https://riverside.edu',
    logo: 'https://picsum.photos/seed/school2/100/100',
    principalName: 'Mr. Michael Chen',
    establishedYear: 1992,
    totalStudents: 850,
    totalTeachers: 65,
    totalStaff: 28,
    academicYear: '2024-2025',
    status: 'active',
    subscription: {
      plan: 'enterprise',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active'
    },
    settings: {
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      language: 'en',
      dateFormat: 'MM/DD/YYYY'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-23T00:00:00Z'
  }
];

// Service Functions
export const getSchools = async (): Promise<School[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockSchools;
};

export const getSchoolById = async (id: string): Promise<School | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSchools.find(school => school.id === id) || null;
};

export const createSchool = async (schoolData: Omit<School, 'id' | 'createdAt' | 'updatedAt'>): Promise<School> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newSchool: School = {
    ...schoolData,
    id: `school-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockSchools.push(newSchool);
  return newSchool;
};

export const updateSchool = async (id: string, updates: Partial<School>): Promise<School | null> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const schoolIndex = mockSchools.findIndex(school => school.id === id);
  if (schoolIndex === -1) return null;
  
  mockSchools[schoolIndex] = {
    ...mockSchools[schoolIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  return mockSchools[schoolIndex];
};

export const deleteSchool = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const schoolIndex = mockSchools.findIndex(school => school.id === id);
  if (schoolIndex === -1) return false;
  
  mockSchools.splice(schoolIndex, 1);
  return true;
};

// Dashboard Analytics
export const getSchoolAnalytics = async (schoolId?: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    totalSchools: mockSchools.length,
    activeSchools: mockSchools.filter(s => s.status === 'active').length,
    totalStudents: mockSchools.reduce((sum, s) => sum + s.totalStudents, 0),
    totalTeachers: mockSchools.reduce((sum, s) => sum + s.totalTeachers, 0),
    subscriptionBreakdown: {
      basic: mockSchools.filter(s => s.subscription.plan === 'basic').length,
      premium: mockSchools.filter(s => s.subscription.plan === 'premium').length,
      enterprise: mockSchools.filter(s => s.subscription.plan === 'enterprise').length
    },
    monthlyRevenue: 125000,
    growthRate: 12.5,
    churnRate: 2.1
  };
};

// Mock Students Data
export const mockStudents: Student[] = [
  {
    id: 'student-1',
    schoolId: 'school-1',
    studentId: 'GW2024001',
    firstName: 'Emma',
    lastName: 'Wilson',
    email: 'emma.wilson@student.greenwood.edu',
    phone: '+1-555-0111',
    dateOfBirth: '2010-03-15',
    gender: 'female',
    address: '789 Student Lane, Learning City, LC 12345',
    parentId: 'parent-1',
    classId: 'class-8a',
    grade: '8',
    section: 'A',
    admissionDate: '2024-08-15',
    status: 'active',
    profilePicture: 'https://picsum.photos/seed/student1/100/100',
    emergencyContact: {
      name: 'John Wilson',
      phone: '+1-555-0112',
      relationship: 'Father'
    },
    medicalInfo: {
      allergies: ['Peanuts'],
      medications: [],
      conditions: []
    },
    academicRecord: {
      gpa: 3.8,
      attendance: 95,
      behaviorScore: 4.5,
      achievements: ['Honor Roll', 'Science Fair Winner']
    },
    createdAt: '2024-08-15T00:00:00Z',
    updatedAt: '2024-06-23T00:00:00Z'
  },
  {
    id: 'student-2',
    schoolId: 'school-1',
    studentId: 'GW2024002',
    firstName: 'Liam',
    lastName: 'Rodriguez',
    email: 'liam.rodriguez@student.greenwood.edu',
    phone: '+1-555-0113',
    dateOfBirth: '2009-07-22',
    gender: 'male',
    address: '456 Scholar St, Learning City, LC 12345',
    parentId: 'parent-2',
    classId: 'class-9b',
    grade: '9',
    section: 'B',
    admissionDate: '2024-08-15',
    status: 'active',
    profilePicture: 'https://picsum.photos/seed/student2/100/100',
    emergencyContact: {
      name: 'Maria Rodriguez',
      phone: '+1-555-0114',
      relationship: 'Mother'
    },
    medicalInfo: {
      allergies: [],
      medications: ['Inhaler'],
      conditions: ['Asthma']
    },
    academicRecord: {
      gpa: 3.6,
      attendance: 92,
      behaviorScore: 4.2,
      achievements: ['Math Competition Finalist']
    },
    createdAt: '2024-08-15T00:00:00Z',
    updatedAt: '2024-06-23T00:00:00Z'
  }
];

// Mock Teachers Data
export const mockTeachers: Teacher[] = [
  {
    id: 'teacher-1',
    schoolId: 'school-1',
    employeeId: 'GW-T001',
    firstName: 'Dr. Jennifer',
    lastName: 'Adams',
    email: 'j.adams@greenwood.edu',
    phone: '+1-555-0201',
    dateOfBirth: '1985-05-10',
    gender: 'female',
    address: '321 Faculty Ave, Learning City, LC 12345',
    subjects: ['Mathematics', 'Physics'],
    classes: ['8A', '9A', '9B'],
    qualifications: ['PhD in Mathematics', 'Teaching Certificate'],
    experience: 8,
    joinDate: '2020-08-15',
    salary: 65000,
    status: 'active',
    profilePicture: 'https://picsum.photos/seed/teacher1/100/100',
    performance: {
      rating: 4.8,
      studentFeedback: 4.7,
      parentFeedback: 4.9,
      achievements: ['Teacher of the Year 2023', 'Excellence in STEM Education']
    },
    schedule: {
      monday: {
        periods: [
          { time: '09:00-10:00', subject: 'Mathematics', class: '8A' },
          { time: '10:30-11:30', subject: 'Physics', class: '9A' }
        ]
      },
      tuesday: {
        periods: [
          { time: '09:00-10:00', subject: 'Mathematics', class: '9B' },
          { time: '11:00-12:00', subject: 'Physics', class: '9A' }
        ]
      }
    },
    createdAt: '2020-08-15T00:00:00Z',
    updatedAt: '2024-06-23T00:00:00Z'
  }
];

// Mock Parents Data
export const mockParents: Parent[] = [
  {
    id: 'parent-1',
    schoolId: 'school-1',
    firstName: 'John',
    lastName: 'Wilson',
    email: 'john.wilson@email.com',
    phone: '+1-555-0112',
    address: '789 Student Lane, Learning City, LC 12345',
    occupation: 'Software Engineer',
    relationship: 'father',
    studentIds: ['student-1'],
    emergencyContact: true,
    communicationPreferences: {
      email: true,
      sms: true,
      phone: false
    },
    paymentInfo: {
      method: 'card',
      cardLast4: '1234'
    },
    meetings: [
      {
        id: 'meeting-1',
        date: '2024-07-15',
        time: '14:00',
        teacherId: 'teacher-1',
        subject: 'Academic Progress Discussion',
        status: 'completed'
      }
    ],
    createdAt: '2024-08-15T00:00:00Z',
    updatedAt: '2024-06-23T00:00:00Z'
  }
];

// Mock Finance Data
export const mockFinanceRecords: FinanceRecord[] = [
  {
    id: 'finance-1',
    schoolId: 'school-1',
    type: 'income',
    category: 'Tuition Fees',
    amount: 25000,
    currency: 'USD',
    description: 'Monthly tuition collection',
    date: '2024-06-01',
    paymentMethod: 'Bank Transfer',
    reference: 'TF-202406-001',
    status: 'completed',
    createdBy: 'admin-1',
    createdAt: '2024-06-01T00:00:00Z'
  },
  {
    id: 'finance-2',
    schoolId: 'school-1',
    type: 'expense',
    category: 'Staff Salaries',
    amount: 15000,
    currency: 'USD',
    description: 'Monthly staff salary payments',
    date: '2024-06-01',
    paymentMethod: 'Bank Transfer',
    reference: 'SAL-202406-001',
    status: 'completed',
    createdBy: 'admin-1',
    createdAt: '2024-06-01T00:00:00Z'
  }
];

// Mock Marketing Data
export const mockMarketingCampaigns: MarketingCampaign[] = [
  {
    id: 'campaign-1',
    schoolId: 'school-1',
    name: 'Summer Enrollment Drive',
    type: 'digital',
    status: 'active',
    targetAudience: 'parents',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    budget: 5000,
    spent: 2500,
    metrics: {
      reach: 15000,
      engagement: 1200,
      conversions: 85,
      leads: 150
    },
    content: {
      title: 'Enroll Your Child Today!',
      description: 'Join our award-winning school community',
      imageUrl: 'https://picsum.photos/seed/campaign1/400/300',
      callToAction: 'Schedule a Tour'
    },
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-23T00:00:00Z'
  }
];

// Additional Service Functions
export const getStudents = async (schoolId?: string): Promise<Student[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return schoolId ? mockStudents.filter(s => s.schoolId === schoolId) : mockStudents;
};

export const getTeachers = async (schoolId?: string): Promise<Teacher[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return schoolId ? mockTeachers.filter(t => t.schoolId === schoolId) : mockTeachers;
};

export const getParents = async (schoolId?: string): Promise<Parent[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return schoolId ? mockParents.filter(p => p.schoolId === schoolId) : mockParents;
};

export const getFinanceRecords = async (schoolId?: string): Promise<FinanceRecord[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return schoolId ? mockFinanceRecords.filter(f => f.schoolId === schoolId) : mockFinanceRecords;
};

export const getMarketingCampaigns = async (schoolId?: string): Promise<MarketingCampaign[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return schoolId ? mockMarketingCampaigns.filter(c => c.schoolId === schoolId) : mockMarketingCampaigns;
};
