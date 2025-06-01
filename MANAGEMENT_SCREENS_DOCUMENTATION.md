... shell ...
\`\`\`

## Company Management

### Features

- **Company Listing**: Paginated table with search and sort
- **Company Creation**: Form-based company registration
- **Company Editing**: Update company information
- **Company Details**: View comprehensive company information
- **Company Deletion**: Soft delete with confirmation

### Access Control

- **Role Required**: `GENERAL_ADMIN`
- **Route**: `/admin/companies`

### Component Specifications

#### CompanyManagementPage

**Purpose**: Main container for company management functionality

**Props**: None

**State Management**:
- Uses `useCompanies` hook for state management
- Manages modal visibility states
- Handles success/error messages

**Key Methods**:
\`\`\`typescript
handleCreate(data: CreateCompanyRequest): Promise<boolean>
handleEdit(data: UpdateCompanyRequest): Promise<boolean>
handleDelete(): Promise<void>
\`\`\`

#### CompanyList

**Purpose**: Display companies in a paginated table format

**Props**:
\`\`\`typescript
interface CompanyListProps {
  onEdit: (company: Company) => void
  onDelete: (company: Company) => void
  onView: (company: Company) => void
}
\`\`\`

**Features**:
- Search functionality
- Column sorting
- Pagination controls
- Action buttons (View/Edit/Delete)

#### CompanyForm

**Purpose**: Form component for creating and editing companies

**Props**:
\`\`\`typescript
interface CompanyFormProps {
  company?: Company | null
  onSubmit: (data: CreateCompanyRequest | UpdateCompanyRequest) => Promise<boolean>
  onCancel: () => void
  isLoading?: boolean
  error?: string | null
}
\`\`\`

**Validation Rules**:
- Company name: Required
- Email: Valid email format (optional)
- Website: Valid URL format (optional)

## Parking Management

### Features

- **Parking Listing**: Company-specific parking locations
- **Parking Creation**: Add new parking locations
- **Parking Editing**: Update parking information and capacity
- **Parking Details**: View detailed parking information and statistics
- **Parking Deletion**: Remove parking locations

### Access Control

- **Roles Required**: `GENERAL_ADMIN`, `COMPANY_ADMIN`
- **Route**: `/company/parkings`
- **Data Filtering**: Company Admins see only their company's parkings

### Component Specifications

#### ParkingManagementPage

**Purpose**: Main container for parking management functionality

**Props**: None

**State Management**:
- Uses `useParkings` hook for state management
- Filters data by user's company ID
- Manages modal visibility states

#### ParkingList

**Purpose**: Display parking locations in a paginated table

**Props**:
\`\`\`typescript
interface ParkingListProps {
  onEdit: (parking: Parking) => void
  onDelete: (parking: Parking) => void
  onView: (parking: Parking) => void
}
\`\`\`

**Features**:
- Company-filtered data
- Capacity information display
- Operating hours display
- Status indicators

#### ParkingForm

**Purpose**: Form component for creating and editing parking locations

**Props**:
\`\`\`typescript
interface ParkingFormProps {
  parking?: Parking | null
  onSubmit: (data: CreateParkingRequest | UpdateParkingRequest) => Promise<boolean>
  onCancel: () => void
  isLoading?: boolean
  error?: string | null
}
\`\`\`

**Validation Rules**:
- Parking name: Required
- Address: Required
- Latitude: -90 to 90 (optional)
- Longitude: -180 to 180 (optional)
- Total floors: Minimum 1

## API Integration

### Company Service

\`\`\`typescript
class CompanyService {
  async getAllCompanies(params?: SearchParams): Promise<PageResponse<Company>>
  async getCompanyById(id: string): Promise<Company>
  async createCompany(data: CreateCompanyRequest): Promise<Company>
  async updateCompany(id: string, data: UpdateCompanyRequest): Promise<Company>
  async deleteCompany(id: string): Promise<void>
}
\`\`\`

### Parking Service

\`\`\`typescript
class ParkingService {
  async getAllParkings(params?: SearchParams): Promise<PageResponse<Parking>>
  async getParkingById(id: string): Promise<Parking>
  async createParking(data: CreateParkingRequest): Promise<Parking>
  async updateParking(id: string, data: UpdateParkingRequest): Promise<Parking>
  async deleteParking(id: string): Promise<void>
}
\`\`\`

### API Request Examples

#### Create Company
\`\`\`typescript
const newCompany = await companyService.createCompany({
  name: "Tech Parking Solutions",
  description: "Leading parking technology company",
  address: "123 Tech Street, Silicon Valley",
  phone: "+1-555-0123",
  email: "info@techparking.com",
  website: "https://techparking.com"
})
\`\`\`

#### Create Parking
\`\`\`typescript
const newParking = await parkingService.createParking({
  companyId: "company-uuid",
  name: "Downtown Garage",
  description: "Central parking facility",
  address: "456 Main Street, Downtown",
  latitude: 40.7128,
  longitude: -74.0060,
  totalFloors: 3,
  operatingHoursStart: "07:00",
  operatingHoursEnd: "22:00"
})
\`\`\`

## State Management

### Redux Slices

#### Company Slice

**State Structure**:
\`\`\`typescript
interface CompanyState {
  companies: Company[]
  currentCompany: Company | null
  isLoading: boolean
  error: string | null
  pagination: PaginationInfo
}
\`\`\`

**Actions**:
- `fetchCompanies`: Load companies with pagination
- `fetchCompanyById`: Load single company
- `createCompany`: Create new company
- `updateCompany`: Update existing company
- `deleteCompany`: Delete company
- `clearError`: Clear error state

#### Parking Slice

**State Structure**:
\`\`\`typescript
interface ParkingState {
  parkings: Parking[]
  currentParking: Parking | null
  isLoading: boolean
  error: string | null
  pagination: PaginationInfo
}
\`\`\`

**Actions**:
- `fetchParkings`: Load parkings with filtering
- `fetchParkingById`: Load single parking
- `createParking`: Create new parking
- `updateParking`: Update existing parking
- `deleteParking`: Delete parking
- `clearError`: Clear error state

### Custom Hooks

#### useCompanies Hook

\`\`\`typescript
const {
  companies,
  currentCompany,
  isLoading,
  error,
  pagination,
  loadCompanies,
  addCompany,
  editCompany,
  removeCompany,
  clearCompanyError
} = useCompanies()
\`\`\`

#### useParkings Hook

\`\`\`typescript
const {
  parkings,
  currentParking,
  isLoading,
  error,
  pagination,
  loadParkings,
  addParking,
  editParking,
  removeParking,
  clearParkingError
} = useParkings()
\`\`\`

## Component Specifications

### Reusable UI Components

#### Table Component

**Purpose**: Generic table component with sorting and pagination

**Props**:
\`\`\`typescript
interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyText?: string
  onSort?: (key: string, order: "asc" | "desc") => void
  sortKey?: string
  sortOrder?: "asc" | "desc"
}
\`\`\`

**Features**:
- Generic type support
- Column configuration
- Sorting capabilities
- Loading states
- Empty state handling

#### Modal Component

**Purpose**: Reusable modal dialog

**Props**:
\`\`\`typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  showCloseButton?: boolean
}
\`\`\`

**Features**:
