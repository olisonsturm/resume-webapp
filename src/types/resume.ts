export interface Header {
  name: string;
  title: string;
  phone: string;
  email: string;
  location: string;
  link: string;
  photo: string;
}

export interface Experience {
  id: string;
  position: string;
  workplace: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  bullets: string[];
  logo?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
  logo?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
}

export interface Language {
  id: string;
  name: string;
  level: 'Native' | 'Advanced' | 'Intermediate' | 'Basic';
}

export interface Resume {
  header: Header;
  experience: Experience[];
  education: Education[];
  achievements: Achievement[];
  certifications: Certification[];
  skills: string[];
  languages: Language[];
}
