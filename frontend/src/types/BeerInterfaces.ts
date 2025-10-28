export interface Beer {
  _id: string;
  name: string;
  brewery: string;
  style: string;
  abv: number;
  rating?: number;
  notes?: string;
  drank: boolean;
  dateAdded: string;
  dateDrank?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BeerInput {
  name: string;
  brewery: string;
  style: string;
  abv: number;
  rating?: number | undefined;
  notes?: string | undefined;
  drank?: boolean | undefined;
}

export interface BeerUpdate extends Partial<BeerInput> {}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface BeerStats {
  totalBeers: number;
  drankBeers: number;
  pendingBeers: number;
  ratedBeers: number;
  averageRating: number;
  topStyle?: {
    style: string;
    count: number;
  };
  topBrewery?: {
    brewery: string;
    count: number;
  };
}

export interface BeerFormProps {
  beer?: Beer | undefined;
  onSave: (beerData: BeerInput) => Promise<void>;
  onCancel: () => void;
}

export interface BeerListProps {
  beers: Beer[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (beer: Beer) => void;
  onMarkAsDrank: (id: string) => Promise<void>;
}

export interface BeerStatsProps {
  beers: Beer[];
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AppState {
  beers: Beer[];
  loading: LoadingState;
  error: string | null;
  showForm: boolean;
  editingBeer: Beer | undefined;
}
