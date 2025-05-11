export interface StationData {
    stationId: number
    stationTypeIndex: number
    mapLinks: MapLinks
    languages: Language[]
    image: string
    GPS:number[]
  }
  
  export interface MapLinks {
    google: string
  }
  
  export interface Language {
    language: string
    title: string
    description: string
  }
  