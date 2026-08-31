export type SearchType = "ALL" | "ARTIST" | "HOST" | "FESTIVAL";

export type ArtistResult = {
  artistId: number;
  name: string;
  imageUrl: string | null;
  appearanceCount: number;
  latestAppearanceDate: string | null;
};

export type HostResult = {
  hostId: number;
  name: string;
  logoUrl: string | null;
  festivalCount: number;
  latestFestivalYearMonth: string | null;
};

export type FestivalResult = {
  festivalId: number;
  name: string;
  host: { hostId: number; name: string; logoUrl: string | null };
  startDate: string;
  endDate: string;
  posterUrl: string | null;
};

export type SearchCounts = {
  all: number;
  festival: number;
  artist: number;
  host: number;
};

export type SearchResponse = {
  query: string;
  selectedType: SearchType;
  counts: SearchCounts;
  festivals: FestivalResult[];
  artists: ArtistResult[];
  hosts: HostResult[];
  relatedKeywords: string[];
};
