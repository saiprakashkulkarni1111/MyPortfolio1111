/**
 * Data Contracts & Schemas
 * 
 * PYTHON TRANSLATION GUIDE:
 * - TypeScript `interface` == Python `@dataclass` or Pydantic `BaseModel`
 * - `string` == `str`
 * - `number` == `int` or `float`
 * - `string[]` == `List[str]`
 * - `field?: string` == `field: Optional[str] = None`
 */

// Python Equivalent:
// @dataclass
// class Publication:
//     title: str
//     role: str
//     date: str
//     location: str
//     status: str
//     abstract: str
//     highlights: List[str]
//     tags: List[str]
//     paper_link: Optional[str] = None
export interface Publication {
  title: string;
  role: string;
  date: string;
  location: string;
  status: string;
  abstract: string;
  highlights: string[];
  paperLink?: string;
  tags: string[];
}

// Python Equivalent:
// @dataclass
// class ProjectCodeSnippet:
//     filename: str
//     language: str
//     architecture_highlight: str
//     code: str
//     highlights: List[str]
export interface ProjectCodeSnippet {
  filename: string;
  language: string;
  architectureHighlight: string;
  code: string;
  highlights: string[];
}

// Python Equivalent:
// @dataclass
// class Project:
//     id: str
//     title: str
//     category: str
//     timeline: str
//     technologies: List[str]
//     tagline: str
//     metrics: List[Dict[str, str]]
//     bullet_points: List[str]
//     system_overview: str
//     architecture_steps: List[str]
//     code_snippet: Optional[ProjectCodeSnippet] = None
export interface Project {
  id: string;
  title: string;
  category: string;
  timeline: string;
  technologies: string[];
  tagline: string;
  metrics: { label: string; value: string }[];
  bulletPoints: string[];
  systemOverview: string;
  architectureSteps: string[];
  codeSnippet?: ProjectCodeSnippet;
}

// Python Equivalent:
// @dataclass
// class Skill:
//     name: str
//     level: int  # 1 to 100
//     description: str
//     used_in: List[str]
//     badge: Optional[str] = None
//
// @dataclass
// class SkillCategory:
//     category: str
//     skills: List[Skill]
export interface SkillCategory {
  category: string;
  skills: {
    name: string;
    level: number; // 1 to 100
    badge?: string;
    description: string;
    usedIn: string[];
  }[];
}

// Python Equivalent:
// @dataclass
// class Education:
//     institution: str
//     degree: str
//     field: str
//     score: str
//     duration: str
//     location: str
//     highlights: Optional[List[str]] = None
export interface Education {
  institution: string;
  degree: string;
  field: string;
  score: string;
  duration: string;
  location: string;
  highlights?: string[];
}

// Python Equivalent:
// @dataclass
// class Certification:
//     title: str
//     issuer: str
//     year: str
//     type: str  # Literal['certification', 'award', 'leadership']
//     details: str
//     badge: Optional[str] = None
export interface Certification {
  title: string;
  issuer: string;
  badge?: string;
  year: string;
  type: 'certification' | 'award' | 'leadership';
  details: string;
}

// Python Equivalent:
// @dataclass
// class SocialLinks:
//     email: str
//     phone: str
//     linkedin: str
//     github: str
//     location: str
export interface SocialLinks {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
}

